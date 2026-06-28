import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

export default function App() {
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Quantum Edge Mobile</Text>
        <Text style={styles.subtitle}>Web sürümü için:</Text>
        <Text style={styles.link}>http://localhost:5173</Text>
        <Text style={styles.info}>Telefonda test etmek için Expo Go ile QR kodu okutun</Text>
      </View>
    );
  }

  // iOS ve Android için WebView
  const { WebView } = require('react-native-webview');
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: 'http://localhost:5173' }}
        style={styles.webview}
        startInLoadingState
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0e14', justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { color: '#60a5fa', fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  subtitle: { color: '#94a3b8', fontSize: 16, marginBottom: 10 },
  link: { color: '#22c55e', fontSize: 20, marginBottom: 20 },
  info: { color: '#64748b', fontSize: 14, textAlign: 'center' },
  webview: { flex: 1, width: '100%' },
});