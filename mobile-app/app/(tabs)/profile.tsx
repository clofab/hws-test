import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, Switch,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../src/context/authStore";
import { theme } from "../../src/theme";

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [notifs, setNotifs] = useState(true);

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : "??";

  const handleLogout = () =>
    Alert.alert("Déconnexion", "Confirmer la déconnexion ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Déconnexion", style: "destructive",
        onPress: async () => { await logout(); router.replace("/login"); },
      },
    ]);

  const MenuItem = ({
    icon, label, value, onPress, danger = false, right,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value?: string;
    onPress?: () => void;
    danger?: boolean;
    right?: React.ReactNode;
  }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} disabled={!onPress && !right}>
      <View style={[styles.menuIcon, danger && styles.menuIconDanger]}>
        <Ionicons name={icon} size={17} color={danger ? theme.colors.error : theme.colors.primary} />
      </View>
      <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>{label}</Text>
      <View style={styles.menuRight}>
        {value && <Text style={styles.menuValue}>{value}</Text>}
        {right ?? (onPress && (
          <Ionicons name="chevron-forward" size={15} color={theme.colors.textMuted} />
        ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Avatar hero */}
        <View style={styles.hero}>
          <View style={styles.avatarRing}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          </View>
          <Text style={styles.heroName}>{user?.firstName} {user?.lastName}</Text>
          <Text style={styles.heroEmail}>{user?.email}</Text>
          <View style={styles.heroBadge}>
            <Ionicons name="shield-checkmark" size={12} color={theme.colors.primary} />
            <Text style={styles.heroBadgeText}>{user?.role ?? "USER"}</Text>
          </View>
        </View>

        {/* Compte */}
        <Text style={styles.section}>Compte</Text>
        <View style={styles.card}>
          <MenuItem icon="create-outline" label="Modifier le profil" onPress={() => {}} />
          <MenuItem icon="lock-closed-outline" label="Changer le mot de passe" onPress={() => {}} />
          <MenuItem icon="mail-outline" label="Email" value={user?.email} />
        </View>

        {/* Préférences */}
        <Text style={styles.section}>Préférences</Text>
        <View style={styles.card}>
          <MenuItem
            icon="notifications-outline"
            label="Notifications"
            right={
              <Switch
                value={notifs}
                onValueChange={setNotifs}
                trackColor={{ false: theme.colors.bgElevated, true: theme.colors.primary }}
                thumbColor="#fff"
              />
            }
          />
          <MenuItem icon="moon-outline" label="Thème sombre" value="Activé" />
          <MenuItem icon="language-outline" label="Langue" value="Français" onPress={() => {}} />
        </View>

        {/* Sécurité */}
        <Text style={styles.section}>Sécurité</Text>
        <View style={styles.card}>
          <MenuItem icon="finger-print-outline" label="Biométrie" onPress={() => {}} />
          <MenuItem icon="shield-outline" label="Double authentification" value="Désactivé" onPress={() => {}} />
          <MenuItem icon="time-outline" label="Sessions actives" onPress={() => {}} />
        </View>

        {/* Danger zone */}
        <Text style={styles.section}>Compte</Text>
        <View style={styles.card}>
          <MenuItem icon="log-out-outline" label="Se déconnecter" onPress={handleLogout} danger />
          <MenuItem icon="trash-outline" label="Supprimer le compte" onPress={() => {}} danger />
        </View>

        <Text style={styles.version}>Version 1.0.0 · Spring Boot API</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  scroll: { paddingHorizontal: theme.spacing.lg, paddingBottom: 40, paddingTop: 60 },
  hero: { alignItems: "center", marginBottom: theme.spacing.xl },
  avatarRing: {
    width: 90, height: 90, borderRadius: 45,
    borderWidth: 2, borderColor: theme.colors.primary,
    alignItems: "center", justifyContent: "center",
    marginBottom: 14, ...theme.shadows.glow,
  },
  avatar: {
    width: 78, height: 78, borderRadius: 39,
    backgroundColor: theme.colors.primary,
    alignItems: "center", justifyContent: "center",
  },
  avatarText: { color: "#fff", fontSize: 26, fontWeight: "700" },
  heroName: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.black,
    color: theme.colors.textPrimary,
    letterSpacing: -0.5,
  },
  heroEmail: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    marginTop: 4, marginBottom: 10,
  },
  heroBadge: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: theme.colors.accentGlow,
    paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: theme.radius.full,
    borderWidth: 1, borderColor: theme.colors.border,
  },
  heroBadgeText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.semibold,
  },
  section: {
    fontSize: 11, fontWeight: "600",
    color: theme.colors.textMuted, textTransform: "uppercase",
    letterSpacing: 1.2, marginBottom: 10, marginTop: 6,
  },
  card: {
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.radius.xl,
    borderWidth: 1, borderColor: theme.colors.border,
    overflow: "hidden", marginBottom: theme.spacing.lg,
  },
  menuItem: {
    flexDirection: "row", alignItems: "center",
    padding: theme.spacing.md, gap: 12,
    borderBottomWidth: 1, borderBottomColor: theme.colors.border,
  },
  menuIcon: {
    width: 34, height: 34, borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.accentGlow,
    alignItems: "center", justifyContent: "center",
  },
  menuIconDanger: { backgroundColor: "rgba(248,113,113,0.12)" },
  menuLabel: {
    flex: 1, fontSize: theme.typography.sizes.base,
    color: theme.colors.textPrimary, fontWeight: theme.typography.weights.medium,
  },
  menuLabelDanger: { color: theme.colors.error },
  menuRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  menuValue: { fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary },
  version: {
    textAlign: "center", fontSize: 11,
    color: theme.colors.textMuted, marginTop: 8,
  },
});
