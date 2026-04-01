import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../context/authStore";
import { theme } from "../../theme";

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({
  icon,
  label,
  value,
  color,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  color: string;
}) => (
  <View style={[styles.statCard, { borderColor: color + "33" }]}>
    <View style={[styles.statIcon, { backgroundColor: color + "22" }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const { user, logout, isLoading } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Déconnexion",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/login");
          },
        },
      ]
    );
  };

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : "??";

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Bonjour";
    if (h < 18) return "Bon après-midi";
    return "Bonsoir";
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.bgOrb} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.topBarInfo}>
            <Text style={styles.greeting}>{greeting()},</Text>
            <Text style={styles.userName}>
              {user?.firstName} {user?.lastName}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleLogout}
            style={styles.logoutBtn}
            disabled={isLoading}
          >
            <Ionicons
              name="log-out-outline"
              size={20}
              color={theme.colors.error}
            />
          </TouchableOpacity>
        </View>

        {/* Welcome Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerBadge}>
            <Ionicons
              name="shield-checkmark"
              size={13}
              color={theme.colors.success}
            />
            <Text style={styles.bannerBadgeText}>Authentifié</Text>
          </View>
          <Text style={styles.bannerTitle}>Tableau de bord</Text>
          <Text style={styles.bannerSub}>
            Votre session est active et sécurisée via JWT.
          </Text>
        </View>

        {/* Stats */}
        <Text style={styles.sectionTitle}>Aperçu du compte</Text>
        <View style={styles.statsGrid}>
          <StatCard
            icon="person-circle-outline"
            label="Rôle"
            value={user?.role ?? "USER"}
            color={theme.colors.primary}
          />
          <StatCard
            icon="mail-outline"
            label="Email vérifié"
            value="Oui"
            color={theme.colors.success}
          />
          <StatCard
            icon="calendar-outline"
            label="Membre depuis"
            value={
              user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("fr-FR", {
                    month: "short",
                    year: "numeric",
                  })
                : "—"
            }
            color={theme.colors.accent}
          />
          <StatCard
            icon="key-outline"
            label="Token"
            value="Actif"
            color={theme.colors.warning}
          />
        </View>

        {/* User Info Card */}
        <Text style={styles.sectionTitle}>Informations</Text>
        <View style={styles.infoCard}>
          {[
            { label: "Prénom", value: user?.firstName ?? "—", icon: "person-outline" },
            { label: "Nom", value: user?.lastName ?? "—", icon: "person-outline" },
            { label: "Email", value: user?.email ?? "—", icon: "mail-outline" },
            { label: "Identifiant", value: `#${user?.id ?? "—"}`, icon: "finger-print-outline" },
          ].map((item, i, arr) => (
            <View
              key={item.label}
              style={[
                styles.infoRow,
                i < arr.length - 1 && styles.infoRowBorder,
              ]}
            >
              <Ionicons
                name={item.icon as keyof typeof Ionicons.glyphMap}
                size={16}
                color={theme.colors.textMuted}
                style={{ width: 24 }}
              />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValue}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Actions rapides</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons
              name="create-outline"
              size={18}
              color={theme.colors.primary}
            />
            <Text style={styles.actionText}>Modifier le profil</Text>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={theme.colors.textMuted}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons
              name="notifications-outline"
              size={18}
              color={theme.colors.primary}
            />
            <Text style={styles.actionText}>Notifications</Text>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={theme.colors.textMuted}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons
              name="shield-outline"
              size={18}
              color={theme.colors.primary}
            />
            <Text style={styles.actionText}>Sécurité & Confidentialité</Text>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={theme.colors.textMuted}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  bgOrb: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(108, 99, 255, 0.09)",
    top: -100,
    right: -80,
  },
  scroll: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing["2xl"],
    paddingTop: 56,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.glow,
  },
  avatarText: {
    color: "#fff",
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.bold,
  },
  topBarInfo: { flex: 1, marginLeft: 12 },
  greeting: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textMuted,
    fontWeight: theme.typography.weights.medium,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  userName: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.weights.semibold,
  },
  logoutBtn: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    backgroundColor: "rgba(248, 113, 113, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(248, 113, 113, 0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  banner: {
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.card,
  },
  bannerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(74, 222, 128, 0.12)",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: "rgba(74, 222, 128, 0.25)",
    marginBottom: 12,
  },
  bannerBadgeText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.success,
    fontWeight: theme.typography.weights.medium,
  },
  bannerTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.black,
    color: theme.colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  bannerSub: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: theme.spacing.xl,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    alignItems: "flex-start",
    gap: 6,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
  },
  statLabel: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
  },
  infoCard: {
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
    marginBottom: theme.spacing.xl,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    gap: 10,
  },
  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  infoContent: { flex: 1 },
  infoLabel: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.weights.medium,
  },
  actions: {
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  actionText: {
    flex: 1,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.weights.medium,
  },
});
