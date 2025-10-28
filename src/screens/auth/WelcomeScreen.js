import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import api from '../../lib/api';

export default function WelcomeScreen({ navigation }) {
  const [serverOnline, setServerOnline] = useState(null);
  const [checkingServer, setCheckingServer] = useState(true);

  useEffect(() => {
    checkServer();
  }, []);

  const checkServer = async () => {
    setCheckingServer(true);
    const status = await api.checkServerStatus();
    setServerOnline(status.online);
    setCheckingServer(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Server Status Indicator */}
      <View style={styles.serverStatusContainer}>
        {checkingServer ? (
          <View style={[styles.serverStatus, styles.serverChecking]}>
            <ActivityIndicator size="small" color="#666" />
            <Text style={styles.serverStatusText}>Checking server...</Text>
          </View>
        ) : serverOnline ? (
          <View style={[styles.serverStatus, styles.serverOnline]}>
            <Text style={styles.statusDot}>●</Text>
            <Text style={styles.serverStatusText}>Server Online</Text>
          </View>
        ) : (
          <View style={[styles.serverStatus, styles.serverOffline]}>
            <Text style={styles.statusDot}>●</Text>
            <Text style={styles.serverStatusText}>Server Offline</Text>
            <TouchableOpacity onPress={checkServer} style={styles.retryButton}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.header}>
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          {process.env.EXPO_PUBLIC_LOGO_URL ? (
            <Image
              source={{ uri: process.env.EXPO_PUBLIC_LOGO_URL }}
              style={styles.logo}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>🍽️</Text>
            </View>
          )}
        </View>

        <Text style={styles.title}>RedAngels'</Text>
        <Text style={styles.subtitle}>Catering Services</Text>
        <Text style={styles.tagline}>Creating Memorable Dining Experiences</Text>
      </View>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>👨‍🍳</Text>
          <Text style={styles.featureTitle}>Professional Chefs</Text>
          <Text style={styles.featureText}>Expert culinary team with years of experience</Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>🍱</Text>
          <Text style={styles.featureTitle}>Diverse Menu</Text>
          <Text style={styles.featureText}>5-8 course meals tailored to your preference</Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>⭐</Text>
          <Text style={styles.featureTitle}>Premium Quality</Text>
          <Text style={styles.featureText}>Fresh ingredients and exceptional service</Text>
        </View>
      </View>

      {/* CTA Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.primaryButtonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.secondaryButtonText}>Create Account</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footerText}>Perfect catering for all your special events</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 24,
    alignItems: 'center',
  },
  serverStatusContainer: {
    width: '100%',
    marginBottom: 16,
    marginTop: 8
  },
  serverStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8
  },
  serverOnline: {
    backgroundColor: '#d1fae5',
    borderWidth: 1,
    borderColor: '#10b981'
  },
  serverOffline: {
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#ef4444'
  },
  serverChecking: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db'
  },
  statusDot: {
    fontSize: 12,
    color: '#065f46'
  },
  serverStatusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#065f46',
    flex: 1
  },
  retryButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4
  },
  retryText: {
    color: '#b91c1c',
    fontWeight: '600',
    fontSize: 12
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 32,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: '#b91c1c',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 60,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#b91c1c',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  featuresSection: {
    width: '100%',
    marginBottom: 32,
  },
  featureCard: {
    backgroundColor: '#f9fafb',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  featureIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#b91c1c',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#b91c1c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#b91c1c',
  },
  secondaryButtonText: {
    color: '#b91c1c',
    fontSize: 18,
    fontWeight: '700',
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
  },
});
