import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ComponentType, Ref } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Linking,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import WebView, { type WebViewNavigation } from 'react-native-webview';

const DEV_WEB_URL = 'http://localhost:5173';
const WEB_URL = process.env.EXPO_PUBLIC_WEB_URL?.trim() || DEV_WEB_URL;

type WebViewHandle = { reload: () => void; goBack: () => void };
type LearningWebViewProps = {
  ref?: Ref<WebViewHandle>;
  source: { uri: string };
  originWhitelist: string[];
  javaScriptEnabled: boolean;
  domStorageEnabled: boolean;
  sharedCookiesEnabled: boolean;
  setSupportMultipleWindows: boolean;
  allowsBackForwardNavigationGestures: boolean;
  onLoadStart: () => void;
  onLoadEnd: () => void;
  onError: (event: { nativeEvent: { description: string } }) => void;
  onHttpError: (event: { nativeEvent: { statusCode: number } }) => void;
  onContentProcessDidTerminate: () => void;
  onRenderProcessGone: () => void;
  onNavigationStateChange: (state: WebViewNavigation) => void;
  onShouldStartLoadWithRequest: (request: { url: string }) => boolean;
  onOpenWindow: (event: { nativeEvent: { targetUrl: string } }) => void;
  startInLoadingState: boolean;
  renderError: () => null;
  style: StyleProp<ViewStyle>;
};
const LearningWebView = WebView as unknown as ComponentType<LearningWebViewProps>;

function simulatorCompatibleUrl(url: string): string {
  if (Platform.OS !== 'android') return url;

  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
      parsed.hostname = '10.0.2.2';
      return parsed.toString();
    }
  } catch {
    // The validation view below reports malformed configuration with a retry path.
  }

  return url;
}

function parseWebUrl(url: string): URL | null {
  try {
    return new URL(url);
  } catch {
    return null;
  }
}

function AppContent() {
  const webView = useRef<WebViewHandle>(null);
  const [sourceUrl, setSourceUrl] = useState(() => simulatorCompatibleUrl(WEB_URL));
  const source = useMemo(() => parseWebUrl(sourceUrl), [sourceUrl]);
  const isUsingLocalFallback = !process.env.EXPO_PUBLIC_WEB_URL?.trim();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const openExternal = useCallback(async (url: string) => {
    const parsed = parseWebUrl(url);
    if (!parsed) return;

    const allowedScheme = ['https:', 'http:', 'mailto:', 'tel:'].includes(parsed.protocol);
    if (!allowedScheme) return;

    try {
      if (await Linking.canOpenURL(url)) await Linking.openURL(url);
    } catch {
      // A missing mail or phone handler should not take down the learning app.
    }
  }, []);

  const handleNavigation = useCallback(
    (requestUrl: string) => {
      const target = parseWebUrl(requestUrl);
      if (!target) return false;

      if (source && target.origin === source.origin) return true;

      void openExternal(requestUrl);
      return false;
    },
    [openExternal, source],
  );

  const handleLoadStart = useCallback(() => {
    setLoading(true);
    setLoadError(null);
  }, []);

  const handleLoadEnd = useCallback(() => {
    setLoading(false);
  }, []);

  const handleLoadFailure = useCallback((description?: string) => {
    setLoading(false);
    setLoadError(description || '无法连接到学习网站，请检查网络或网站地址。');
  }, []);

  const handleNavigationStateChange = useCallback((state: WebViewNavigation) => {
    setCanGoBack(state.canGoBack);
  }, []);

  const retry = useCallback(() => {
    if (webView.current && !loadError) {
      webView.current.reload();
    } else {
      setLoadError(null);
      setLoading(true);
      setReloadKey((key) => key + 1);
    }
  }, [loadError]);

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!canGoBack) return false;
      webView.current?.goBack();
      return true;
    });

    return () => subscription.remove();
  }, [canGoBack]);

  if (!source || !['http:', 'https:'].includes(source.protocol)) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#f7f8f5" />
        <MessagePanel
          title="网站地址配置无效"
          message="请将 EXPO_PUBLIC_WEB_URL 设置为以 http:// 或 https:// 开头的网站地址，然后重新启动或打包 App。"
          onRetry={retry}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f7f8f5" />
      {isUsingLocalFallback && __DEV__ ? (
        <View style={styles.devNotice}>
          <Text style={styles.devNoticeText}>
            本地开发地址：{sourceUrl}。发布构建请配置 EXPO_PUBLIC_WEB_URL。
          </Text>
        </View>
      ) : null}

      <View style={styles.webViewContainer}>
        <LearningWebView
          key={reloadKey}
          ref={webView}
          source={{ uri: sourceUrl }}
          originWhitelist={['http://*', 'https://*', 'mailto:*', 'tel:*']}
          javaScriptEnabled
          domStorageEnabled
          sharedCookiesEnabled
          setSupportMultipleWindows={false}
          allowsBackForwardNavigationGestures
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          onError={(event) => handleLoadFailure(event.nativeEvent.description)}
          onHttpError={(event) => {
            if (event.nativeEvent.statusCode >= 400) {
              handleLoadFailure(`网站返回错误 ${event.nativeEvent.statusCode}。`);
            }
          }}
          onContentProcessDidTerminate={() => handleLoadFailure('网页进程已停止，请重新加载。')}
          onRenderProcessGone={() => handleLoadFailure('网页进程已停止，请重新加载。')}
          onNavigationStateChange={handleNavigationStateChange}
          onShouldStartLoadWithRequest={(request) => handleNavigation(request.url)}
          onOpenWindow={(event) => {
            const targetUrl = event.nativeEvent.targetUrl;
            const target = parseWebUrl(targetUrl);
            if (target && source && target.origin === source.origin) {
              setLoading(true);
              setLoadError(null);
              setSourceUrl(targetUrl);
            } else {
              void openExternal(targetUrl);
            }
          }}
          startInLoadingState={false}
          renderError={() => null}
          style={styles.webView}
        />

        {loading && !loadError ? (
          <View style={styles.loadingOverlay} pointerEvents="none">
            <ActivityIndicator color="#167c69" size="large" />
            <Text style={styles.loadingText}>正在打开学习计划…</Text>
          </View>
        ) : null}

        {loadError ? (
          <View style={styles.errorOverlay}>
            <MessagePanel
              title="暂时无法打开学习网站"
              message={`${loadError}\n\n${sourceUrl}`}
              onRetry={retry}
            />
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

function MessagePanel({
  title,
  message,
  onRetry,
}: {
  title: string;
  message: string;
  onRetry: () => void;
}) {
  return (
    <View style={styles.messagePanel}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      <Pressable accessibilityRole="button" onPress={onRetry} style={styles.retryButton}>
        <Text style={styles.retryButtonText}>重新加载</Text>
      </Pressable>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f8f5',
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: '#f7f8f5',
  },
  webView: {
    flex: 1,
    backgroundColor: '#f7f8f5',
  },
  devNotice: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#e3f3ef',
  },
  devNoticeText: {
    color: '#245e53',
    fontSize: 12,
    textAlign: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7f8f5',
  },
  loadingText: {
    marginTop: 12,
    color: '#52625e',
    fontSize: 14,
  },
  errorOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f7f8f5',
  },
  messagePanel: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    marginBottom: 12,
    color: '#17332c',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  message: {
    color: '#52625e',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  retryButton: {
    minHeight: 44,
    justifyContent: 'center',
    marginTop: 20,
    paddingHorizontal: 24,
    borderRadius: 10,
    backgroundColor: '#167c69',
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
});
