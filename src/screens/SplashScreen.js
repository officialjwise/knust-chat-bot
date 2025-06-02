"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, Animated, Dimensions, StatusBar, Image } from "react-native"

const { width, height } = Dimensions.get("window")

const SplashScreen = () => {
  const fadeAnim = new Animated.Value(0)
  const scaleAnim = new Animated.Value(0.8)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#006633" barStyle="light-content" />

      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* KNUST Logo from URL */}
        <View style={styles.logo}>
          <Image
            source={{
              uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/KNUST_logo.png/200px-KNUST_logo.png",
            }}
            style={styles.logoImage}
            resizeMode="contain"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(false)}
          />
          {!imageLoaded && <Text style={styles.logoFallback}>🎓</Text>}
        </View>

        <Text style={styles.title}>KNUST Pathfinder</Text>
        <Text style={styles.subtitle}>Your Academic Journey Starts Here</Text>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Kwame Nkrumah University of Science and Technology</Text>
        <View style={styles.loadingIndicator}>
          <View style={styles.loadingDot} />
          <View style={[styles.loadingDot, { animationDelay: "0.2s" }]} />
          <View style={[styles.loadingDot, { animationDelay: "0.2s" }]} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#006633",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 100,
  },
  logo: {
    width: 120,
    height: 120,
    backgroundColor: "#FFFFFF",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoImage: {
    width: 100,
    height: 100,
  },
  logoFallback: {
    fontSize: 48,
    color: "#006633",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    paddingHorizontal: 40,
  },
  footer: {
    position: "absolute",
    bottom: 60,
    alignItems: "center",
  },
  footerText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 40,
  },
  loadingIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFC107",
    marginHorizontal: 4,
  },
})

export default SplashScreen
