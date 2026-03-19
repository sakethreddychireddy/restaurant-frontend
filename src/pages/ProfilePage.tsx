import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { type Theme } from "@/store/themeStore";
import { useTheme } from "@/hooks/useTheme";
import {
  useProfile,
  useUpdateProfile,
  useAddresses,
  useAddAddress,
  useUpdateAddress,
  useDeleteAddress,
} from "@/hooks/useProfile";
import { useAllOrders } from "@/hooks/useOrders";
import { formatCurrency } from "@/utils/format";
import type { AddressRequest, AddressResponse, ProfileResponse } from "@/types";

const LABELS = ["Home", "Work", "Other"];

const THEMES: { id: Theme; label: string; emoji: string; desc: string }[] = [
  { id: "warm", label: "Warm", emoji: "🍂", desc: "Cozy terracotta & cream" },
  { id: "dark", label: "Dark", emoji: "🌙", desc: "Elegant dark mode" },
  { id: "fresh", label: "Fresh", emoji: "🌿", desc: "Clean green & white" },
];

// ── Address Form ───────────────────────────────────────────────
const AddressForm = ({
  initial,
  onSave,
  onCancel,
  isPending,
}: {
  initial?: AddressResponse;
  onSave: (data: AddressRequest) => void;
  onCancel: () => void;
  isPending: boolean;
}) => {
  const [label, setLabel] = useState(initial?.label ?? "Home");
  const [fullAddress, setAddress] = useState(initial?.fullAddress ?? "");
  const [isDefault, setIsDefault] = useState(initial?.isDefault ?? false);

  return (
    <div
      className="space-y-3 p-4 rounded-2xl border"
      style={{
        background: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="flex gap-2">
        {LABELS.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLabel(l)}
            className="px-3 py-1.5 rounded-lg text-sm font-semibold transition-all"
            style={{
              background:
                label === l ? "var(--color-primary)" : "var(--color-bg-card)",
              color: label === l ? "#ffffff" : "var(--color-text-muted)",
              border: `1px solid ${label === l ? "var(--color-primary)" : "var(--color-border)"}`,
            }}
          >
            {l}
          </button>
        ))}
      </div>
      <textarea
        value={fullAddress}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter full address..."
        rows={3}
        className="w-full px-4 py-3 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 transition-all"
        style={{
          background: "var(--color-bg-card)",
          borderColor: "var(--color-border)",
          color: "var(--color-text)",
          border: "1px solid var(--color-border)",
        }}
      />
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isDefault"
          checked={isDefault}
          onChange={(e) => setIsDefault(e.target.checked)}
          className="w-4 h-4"
        />
        <label
          htmlFor="isDefault"
          className="text-sm"
          style={{ color: "var(--color-text-muted)" }}
        >
          Set as default address
        </label>
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="secondary"
          className="flex-1"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="button"
          className="flex-1"
          loading={isPending}
          disabled={!fullAddress.trim()}
          onClick={() => onSave({ label, fullAddress, isDefault })}
        >
          Save Address
        </Button>
      </div>
    </div>
  );
};

// ── Profile Form — only renders when profile is loaded ─────────
const ProfileForm = ({ profile }: { profile: ProfileResponse }) => {
  const [name, setName] = useState(profile.name ?? "");
  const [phone, setPhone] = useState(profile.phone ?? "");
  const { mutate: updateProfile, isPending: updatingProfile } =
    useUpdateProfile();

  return (
    <div className="space-y-4">
      <Input
        label="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
      />
      <Input
        label="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+1 234 567 8900"
      />
      <Button
        loading={updatingProfile}
        onClick={() => updateProfile({ name, phone })}
        className="w-full"
      >
        Save Changes
      </Button>
    </div>
  );
};

// ── Profile skeleton ───────────────────────────────────────────
const ProfileFormSkeleton = () => (
  <div className="space-y-4">
    <div
      className="h-12 rounded-xl animate-pulse"
      style={{ background: "var(--color-surface)" }}
    />
    <div
      className="h-12 rounded-xl animate-pulse"
      style={{ background: "var(--color-surface)" }}
    />
    <div
      className="h-12 rounded-xl animate-pulse"
      style={{ background: "var(--color-surface)" }}
    />
  </div>
);

// ── Main Profile Page ──────────────────────────────────────────
export const ProfilePage = () => {
  const { user } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const isAdmin = user?.role.toLocaleLowerCase() === "admin";

  useTheme();

  const { data: profile } = useProfile();
  const { data: addresses = [] } = useAddresses();
  const { data: allOrders = [] } = useAllOrders();

  const { mutate: addAddress, isPending: addingAddress } = useAddAddress();
  const { mutate: updateAddress, isPending: updatingAddress } =
    useUpdateAddress();
  const { mutate: deleteAddress } = useDeleteAddress();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editAddress, setEditAddress] = useState<AddressResponse | null>(null);

  // ── Admin stats ────────────────────────────────────────────────
  const todayOrders = allOrders.filter((o) => {
    const today = new Date().toDateString();
    return new Date(o.createdAt).toDateString() === today;
  });
  const pendingOrders = allOrders.filter((o) => o.status === "Pending");
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.totalPrice, 0);

  return (
    <div
      className="min-h-screen py-8"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Header */}
        <div className="animate-fade-up">
          <h1
            className="font-display text-4xl font-700"
            style={{ color: "var(--color-text)" }}
          >
            {isAdmin ? "Admin Profile" : "My Profile"}
          </h1>
          <p className="mt-1" style={{ color: "var(--color-text-muted)" }}>
            {isAdmin
              ? "Manage your admin details and preferences"
              : "Manage your details and preferences"}
          </p>
        </div>

        {/* Admin Stats */}
        {isAdmin && (
          <div className="grid grid-cols-3 gap-4 animate-fade-up">
            {[
              {
                label: "Today's Orders",
                value: todayOrders.length,
                emoji: "📋",
              },
              { label: "Pending", value: pendingOrders.length, emoji: "⏳" },
              {
                label: "Today Revenue",
                value: formatCurrency(todayRevenue),
                emoji: "💰",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl p-4 border text-center"
                style={{
                  background: "var(--color-bg-card)",
                  borderColor: "var(--color-border)",
                }}
              >
                <p className="text-2xl mb-1">{stat.emoji}</p>
                <p
                  className="font-display text-xl font-700"
                  style={{ color: "var(--color-text)" }}
                >
                  {stat.value}
                </p>
                <p
                  className="text-xs font-body mt-0.5"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Personal Info */}
        <div
          className="rounded-3xl p-6 border shadow-sm animate-fade-up"
          style={{
            background: "var(--color-bg-card)",
            borderColor: "var(--color-border)",
          }}
        >
          <h2
            className="font-display text-xl font-700 mb-5"
            style={{ color: "var(--color-text)" }}
          >
            Personal Information
          </h2>

          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-display font-700 text-white flex-shrink-0"
              style={{ background: "var(--color-primary)" }}
            >
              {(profile?.name ?? user?.name ?? "U")[0].toUpperCase()}
            </div>
            <div>
              <p
                className="font-700 text-lg"
                style={{ color: "var(--color-text)" }}
              >
                {profile?.name ?? user?.name}
              </p>
              <p
                className="text-sm"
                style={{ color: "var(--color-text-muted)" }}
              >
                {profile?.email ?? user?.email}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-600"
                  style={{
                    background: "var(--color-surface)",
                    color: "var(--color-primary)",
                  }}
                >
                  {isAdmin ? "👑 Admin" : "🙋 Customer"}
                </span>
                {profile?.isOAuthUser && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-600"
                    style={{
                      background: "var(--color-surface)",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    GitHub Account
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Profile form — shows skeleton until profile loads */}
          {profile ? (
            <ProfileForm profile={profile} />
          ) : (
            <ProfileFormSkeleton />
          )}
        </div>

        {/* Addresses — Customer only */}
        {!isAdmin && (
          <div
            className="rounded-3xl p-6 border shadow-sm animate-fade-up"
            style={{
              background: "var(--color-bg-card)",
              borderColor: "var(--color-border)",
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2
                className="font-display text-xl font-700"
                style={{ color: "var(--color-text)" }}
              >
                Saved Addresses
              </h2>
              {!showAddForm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="text-sm font-semibold px-3 py-1.5 rounded-xl transition-all"
                  style={{
                    background: "var(--color-surface)",
                    color: "var(--color-primary)",
                  }}
                >
                  + Add New
                </button>
              )}
            </div>

            {showAddForm && (
              <div className="mb-4">
                <AddressForm
                  onSave={(data) => {
                    addAddress(data, {
                      onSuccess: () => setShowAddForm(false),
                    });
                  }}
                  onCancel={() => setShowAddForm(false)}
                  isPending={addingAddress}
                />
              </div>
            )}

            {addresses.length === 0 && !showAddForm ? (
              <div className="text-center py-8">
                <p className="text-3xl mb-2">📍</p>
                <p
                  className="text-sm"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  No saved addresses yet
                </p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="mt-3 text-sm font-700 underline"
                  style={{ color: "var(--color-primary)" }}
                >
                  Add your first address
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div key={addr.id}>
                    {editAddress?.id === addr.id ? (
                      <AddressForm
                        initial={addr}
                        onSave={(data) => {
                          updateAddress(
                            { id: addr.id, data },
                            { onSuccess: () => setEditAddress(null) },
                          );
                        }}
                        onCancel={() => setEditAddress(null)}
                        isPending={updatingAddress}
                      />
                    ) : (
                      <div
                        className="flex items-start justify-between p-4 rounded-2xl border transition-all"
                        style={{
                          background: addr.isDefault
                            ? "var(--color-surface)"
                            : "var(--color-bg-card)",
                          borderColor: addr.isDefault
                            ? "var(--color-primary)"
                            : "var(--color-border)",
                        }}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className="text-xs font-700 px-2 py-0.5 rounded-full"
                              style={{
                                background: "var(--color-surface)",
                                color: "var(--color-primary)",
                              }}
                            >
                              {addr.label}
                            </span>
                            {addr.isDefault && (
                              <span className="text-xs font-700 text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <p
                            className="text-sm"
                            style={{ color: "var(--color-text)" }}
                          >
                            {addr.fullAddress}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-3 flex-shrink-0">
                          <button
                            onClick={() => setEditAddress(addr)}
                            className="text-xs px-3 py-1.5 rounded-xl font-semibold transition-all"
                            style={{
                              background: "var(--color-surface)",
                              color: "var(--color-text-muted)",
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm("Delete this address?"))
                                deleteAddress(addr.id);
                            }}
                            className="text-xs px-3 py-1.5 rounded-xl font-semibold bg-red-50 text-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Theme Selection */}
        <div
          className="rounded-3xl p-6 border shadow-sm animate-fade-up"
          style={{
            background: "var(--color-bg-card)",
            borderColor: "var(--color-border)",
          }}
        >
          <h2
            className="font-display text-xl font-700 mb-2"
            style={{ color: "var(--color-text)" }}
          >
            App Theme
          </h2>
          <p
            className="text-sm mb-5"
            style={{ color: "var(--color-text-muted)" }}
          >
            Choose your preferred look — saved per account
          </p>

          <div className="space-y-3">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className="w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all"
                style={{
                  background:
                    theme === t.id
                      ? "var(--color-surface)"
                      : "var(--color-bg-card)",
                  borderColor:
                    theme === t.id
                      ? "var(--color-primary)"
                      : "var(--color-border)",
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{t.emoji}</span>
                  <div className="text-left">
                    <p
                      className="font-700 text-sm"
                      style={{ color: "var(--color-text)" }}
                    >
                      {t.label}
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {t.desc}
                    </p>
                  </div>
                </div>
                <div
                  className="w-12 h-6 rounded-full transition-all relative flex-shrink-0"
                  style={{
                    background:
                      theme === t.id
                        ? "var(--color-primary)"
                        : "var(--color-border)",
                  }}
                >
                  <div
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200"
                    style={{
                      left: theme === t.id ? "calc(100% - 20px)" : "4px",
                    }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
