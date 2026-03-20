import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
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
import type { Theme } from "@/store/themeStore";

// ── Constants ──────────────────────────────────────────────────
const LABELS = [
  { id: "Home", emoji: "🏠" },
  { id: "Work", emoji: "💼" },
  { id: "Other", emoji: "📍" },
];

const THEMES: {
  id: Theme;
  label: string;
  emoji: string;
  desc: string;
  preview: string[];
}[] = [
  {
    id: "warm",
    label: "Warm",
    emoji: "🍂",
    desc: "Cozy terracotta & cream",
    preview: ["#faf8f5", "#c17f3d", "#2c2c2c"],
  },
  {
    id: "dark",
    label: "Dark",
    emoji: "🌙",
    desc: "Elegant dark mode",
    preview: ["#1a1a1a", "#c17f3d", "#f5f5f5"],
  },
  {
    id: "fresh",
    label: "Fresh",
    emoji: "🌿",
    desc: "Clean green & white",
    preview: ["#f0fdf4", "#16a34a", "#1a2e1a"],
  },
];

const COUNTRIES = [
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Singapore",
  "UAE",
  "Germany",
  "France",
  "Other",
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
  const [addressLine1, setLine1] = useState(initial?.addressLine1 ?? "");
  const [city, setCity] = useState(initial?.city ?? "");
  const [state, setState] = useState(initial?.state ?? "");
  const [zipCode, setZip] = useState(initial?.zipCode ?? "");
  const [country, setCountry] = useState(initial?.country ?? "India");
  const [isDefault, setDefault] = useState(initial?.isDefault ?? false);

  const isValid =
    addressLine1.trim() &&
    city.trim() &&
    state.trim() &&
    zipCode.trim() &&
    country.trim();

  const inputClass =
    "w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all border";
  const inputStyle = {
    background: "var(--color-bg-card)",
    borderColor: "var(--color-border)",
    color: "var(--color-text)",
  };

  return (
    <div
      className="p-5 rounded-2xl border space-y-4 animate-fade-up"
      style={{
        background: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      {/* Label selector */}
      <div>
        <p
          className="text-xs font-700 mb-2 uppercase tracking-wide"
          style={{ color: "var(--color-text-muted)" }}
        >
          Address Type
        </p>
        <div className="flex gap-2">
          {LABELS.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => setLabel(l.id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-600 transition-all"
              style={{
                background:
                  label === l.id
                    ? "var(--color-primary)"
                    : "var(--color-bg-card)",
                color: label === l.id ? "#ffffff" : "var(--color-text-muted)",
                border: `1.5px solid ${label === l.id ? "var(--color-primary)" : "var(--color-border)"}`,
              }}
            >
              <span>{l.emoji}</span> {l.id}
            </button>
          ))}
        </div>
      </div>

      {/* Address Line 1 */}
      <div>
        <label
          className="block text-xs font-700 mb-1.5 uppercase tracking-wide"
          style={{ color: "var(--color-text-muted)" }}
        >
          Address Line 1 *
        </label>
        <input
          value={addressLine1}
          onChange={(e) => setLine1(e.target.value)}
          placeholder="Flat / House No., Building, Street"
          className={inputClass}
          style={inputStyle}
        />
      </div>

      {/* City + State */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            className="block text-xs font-700 mb-1.5 uppercase tracking-wide"
            style={{ color: "var(--color-text-muted)" }}
          >
            City *
          </label>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Mumbai"
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div>
          <label
            className="block text-xs font-700 mb-1.5 uppercase tracking-wide"
            style={{ color: "var(--color-text-muted)" }}
          >
            State *
          </label>
          <input
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="Maharashtra"
            className={inputClass}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Zip + Country */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            className="block text-xs font-700 mb-1.5 uppercase tracking-wide"
            style={{ color: "var(--color-text-muted)" }}
          >
            ZIP Code *
          </label>
          <input
            value={zipCode}
            onChange={(e) => setZip(e.target.value)}
            placeholder="400001"
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div>
          <label
            className="block text-xs font-700 mb-1.5 uppercase tracking-wide"
            style={{ color: "var(--color-text-muted)" }}
          >
            Country *
          </label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className={inputClass}
            style={inputStyle}
          >
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Default checkbox */}
      <label className="flex items-center gap-3 cursor-pointer group">
        <div
          className="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all"
          style={{
            background: isDefault ? "var(--color-primary)" : "transparent",
            borderColor: isDefault
              ? "var(--color-primary)"
              : "var(--color-border)",
          }}
          onClick={() => setDefault(!isDefault)}
        >
          {isDefault && (
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
        <span
          className="text-sm font-600"
          style={{ color: "var(--color-text-muted)" }}
        >
          Set as default delivery address
        </span>
      </label>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
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
          disabled={!isValid}
          onClick={() =>
            onSave({
              label,
              addressLine1,
              city,
              state,
              zipCode,
              country,
              isDefault,
            })
          }
        >
          Save Address
        </Button>
      </div>
    </div>
  );
};

// ── Address Card ───────────────────────────────────────────────
const AddressCard = ({
  addr,
  onEdit,
  onDelete,
}: {
  addr: AddressResponse;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const labelEmoji = LABELS.find((l) => l.id === addr.label)?.emoji ?? "📍";

  return (
    <div
      className="relative p-4 rounded-2xl border transition-all"
      style={{
        background: addr.isDefault
          ? "var(--color-surface)"
          : "var(--color-bg-card)",
        borderColor: addr.isDefault
          ? "var(--color-primary)"
          : "var(--color-border)",
      }}
    >
      {/* Default ribbon */}
      {addr.isDefault && (
        <div
          className="absolute top-3 right-3 text-xs font-700 px-2 py-0.5 rounded-full"
          style={{
            background: "var(--color-primary)",
            color: "#ffffff",
          }}
        >
          Default
        </div>
      )}

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
          style={{ background: "var(--color-surface)" }}
        >
          {labelEmoji}
        </div>

        {/* Address details */}
        <div className="flex-1 min-w-0 pr-16">
          <p
            className="font-700 text-sm mb-1"
            style={{ color: "var(--color-text)" }}
          >
            {addr.label}
          </p>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--color-text-muted)" }}
          >
            {addr.addressLine1}
          </p>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            {addr.city}, {addr.state} — {addr.zipCode}
          </p>
          <p
            className="text-xs mt-0.5"
            style={{ color: "var(--color-text-muted)" }}
          >
            {addr.country}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div
        className="flex gap-2 mt-3 pt-3 border-t"
        style={{ borderColor: "var(--color-border)" }}
      >
        <button
          onClick={onEdit}
          className="flex-1 py-1.5 rounded-xl text-xs font-700 transition-all"
          style={{
            background: "var(--color-surface)",
            color: "var(--color-primary)",
          }}
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex-1 py-1.5 rounded-xl text-xs font-700 transition-all bg-red-50 text-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

// ── Inline Edit Field ──────────────────────────────────────────
const EditableField = ({
  label,
  value,
  placeholder,
  type = "text",
  onSave,
  isPending,
}: {
  label: string;
  value: string;
  placeholder: string;
  type?: string;
  onSave: (val: string) => void;
  isPending: boolean;
}) => {
  const [editing, setEditing] = useState(false);
  const [localVal, setLocalVal] = useState(value);

  return (
    <div
      className="flex items-center justify-between p-4 rounded-2xl border transition-all"
      style={{
        background: "var(--color-bg-card)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="flex-1 min-w-0">
        <p
          className="text-xs font-700 uppercase tracking-wide mb-1"
          style={{ color: "var(--color-text-muted)" }}
        >
          {label}
        </p>
        {editing ? (
          <input
            type={type}
            value={localVal}
            onChange={(e) => setLocalVal(e.target.value)}
            autoFocus
            className="w-full text-sm font-600 focus:outline-none bg-transparent"
            style={{ color: "var(--color-text)" }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSave(localVal);
                setEditing(false);
              }
              if (e.key === "Escape") {
                setLocalVal(value);
                setEditing(false);
              }
            }}
          />
        ) : (
          <p
            className="text-sm font-600 truncate"
            style={{
              color: value ? "var(--color-text)" : "var(--color-text-muted)",
            }}
          >
            {value || placeholder}
          </p>
        )}
      </div>

      {editing ? (
        <div className="flex gap-2 ml-3 flex-shrink-0">
          <button
            onClick={() => {
              onSave(localVal);
              setEditing(false);
            }}
            disabled={isPending}
            className="text-xs font-700 px-3 py-1.5 rounded-xl text-white transition-all"
            style={{ background: "var(--color-primary)" }}
          >
            {isPending ? "..." : "Save"}
          </button>
          <button
            onClick={() => {
              setLocalVal(value);
              setEditing(false);
            }}
            className="text-xs font-700 px-3 py-1.5 rounded-xl transition-all"
            style={{
              background: "var(--color-surface)",
              color: "var(--color-text-muted)",
            }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="ml-3 flex-shrink-0 text-xs font-700 px-3 py-1.5 rounded-xl transition-all"
          style={{
            background: "var(--color-surface)",
            color: "var(--color-primary)",
          }}
        >
          Edit
        </button>
      )}
    </div>
  );
};

// ── Profile Form — inline edit style ──────────────────────────
const ProfileForm = ({ profile }: { profile: ProfileResponse }) => {
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  return (
    <div className="space-y-3">
      <EditableField
        label="Full Name"
        value={profile.name ?? ""}
        placeholder="Add your name"
        onSave={(name) => updateProfile({ name, phone: profile.phone ?? "" })}
        isPending={isPending}
      />
      <EditableField
        label="Email Address"
        value={profile.email ?? ""}
        placeholder="Add your email"
        type="email"
        onSave={() => {}} // email not editable
        isPending={false}
      />
      <EditableField
        label="Phone Number"
        value={profile.phone ?? ""}
        placeholder="Add phone number"
        type="tel"
        onSave={(phone) => updateProfile({ name: profile.name ?? "", phone })}
        isPending={isPending}
      />
    </div>
  );
};

// ── Profile Skeleton ───────────────────────────────────────────
const ProfileSkeleton = () => (
  <div className="space-y-3">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="h-16 rounded-2xl animate-pulse"
        style={{ background: "var(--color-surface)" }}
      />
    ))}
  </div>
);

// ── Main Profile Page ──────────────────────────────────────────
export const ProfilePage = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role?.toLowerCase() === "admin";
  const { theme, setTheme } = useTheme();

  const { data: profile } = useProfile();
  const { data: addresses = [] } = useAddresses();
  const { data: allOrders = [] } = useAllOrders();

  const { mutate: addAddress, isPending: addingAddress } = useAddAddress();
  const { mutate: updateAddress, isPending: updatingAddress } =
    useUpdateAddress();
  const { mutate: deleteAddress } = useDeleteAddress();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editAddress, setEditAddress] = useState<AddressResponse | null>(null);

  // Admin stats
  const todayOrders = allOrders.filter(
    (o) => new Date(o.createdAt).toDateString() === new Date().toDateString(),
  );
  const pendingOrders = allOrders.filter((o) => o.status === "Pending");
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.totalPrice, 0);
  type QuickLink = {
    icon: string;
    label: string;
    sublabel: string;
    to: string;
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      {/* ── Hero banner ─────────────────────────────────────── */}
      <div
        className="h-32 relative"
        style={{
          background:
            "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* ── Avatar row ────────────────────────────────────── */}
        <div className="relative -mt-12 mb-6 flex items-end justify-between">
          <div className="flex items-end gap-4">
            <div
              className="w-24 h-24 rounded-2xl border-4 flex items-center justify-center text-4xl font-display font-700 text-white shadow-lg"
              style={{
                background: "var(--color-primary)",
                borderColor: "var(--color-bg)",
              }}
            >
              {(user?.name ?? "U")[0].toUpperCase()}
            </div>
            <div className="mb-2">
              <div className="flex items-center gap-2">
                <h1
                  className="font-display text-2xl font-700"
                  style={{ color: "var(--color-text)" }}
                >
                  {user?.name}
                </h1>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-700"
                  style={{
                    background: "var(--color-surface)",
                    color: "var(--color-primary)",
                  }}
                >
                  {isAdmin ? "👑 Admin" : "🙋 Customer"}
                </span>
              </div>
              <p
                className="text-sm mt-0.5"
                style={{ color: "var(--color-text-muted)" }}
              >
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 pb-10">
          {/* ── Admin Stats ─────────────────────────────────── */}
          {isAdmin && (
            <div className="grid grid-cols-3 gap-3 animate-fade-up">
              {[
                {
                  label: "Today's Orders",
                  value: todayOrders.length,
                  emoji: "📋",
                  color: "#3b82f6",
                },
                {
                  label: "Pending",
                  value: pendingOrders.length,
                  emoji: "⏳",
                  color: "#f59e0b",
                },
                {
                  label: "Today Revenue",
                  value: formatCurrency(todayRevenue),
                  emoji: "💰",
                  color: "#22c55e",
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
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* ── Personal Information ─────────────────────────── */}
          <div
            className="rounded-3xl border overflow-hidden animate-fade-up"
            style={{
              background: "var(--color-bg-card)",
              borderColor: "var(--color-border)",
            }}
          >
            <div
              className="px-6 py-4 border-b flex items-center gap-2"
              style={{ borderColor: "var(--color-border)" }}
            >
              <span className="text-lg">👤</span>
              <h2
                className="font-display text-lg font-700"
                style={{ color: "var(--color-text)" }}
              >
                Personal Information
              </h2>
            </div>
            <div className="p-6">
              {profile ? (
                <ProfileForm profile={profile} />
              ) : (
                <ProfileSkeleton />
              )}
              {profile?.isOAuthUser && (
                <div
                  className="mt-4 flex items-center gap-2 px-4 py-3 rounded-xl"
                  style={{
                    background: "var(--color-surface)",
                  }}
                >
                  <span>🔗</span>
                  <p
                    className="text-xs font-600"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    Signed in via GitHub — password login not available
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── Saved Addresses — Customer only ──────────────── */}
          {!isAdmin && (
            <div
              className="rounded-3xl border overflow-hidden animate-fade-up"
              style={{
                background: "var(--color-bg-card)",
                borderColor: "var(--color-border)",
              }}
            >
              <div
                className="px-6 py-4 border-b flex items-center justify-between"
                style={{ borderColor: "var(--color-border)" }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">📍</span>
                  <h2
                    className="font-display text-lg font-700"
                    style={{ color: "var(--color-text)" }}
                  >
                    Saved Addresses
                  </h2>
                  {addresses.length > 0 && (
                    <span
                      className="text-xs font-700 px-2 py-0.5 rounded-full"
                      style={{
                        background: "var(--color-surface)",
                        color: "var(--color-primary)",
                      }}
                    >
                      {addresses.length}
                    </span>
                  )}
                </div>
                {!showAddForm && !editAddress && (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-1.5 text-sm font-700 px-4 py-2 rounded-xl transition-all"
                    style={{
                      background: "var(--color-surface)",
                      color: "var(--color-primary)",
                    }}
                  >
                    + Add New
                  </button>
                )}
              </div>

              <div className="p-6 space-y-4">
                {/* Add form */}
                {showAddForm && (
                  <AddressForm
                    onSave={(data) => {
                      addAddress(data, {
                        onSuccess: () => setShowAddForm(false),
                      });
                    }}
                    onCancel={() => setShowAddForm(false)}
                    isPending={addingAddress}
                  />
                )}

                {/* Empty state */}
                {addresses.length === 0 && !showAddForm && (
                  <div className="text-center py-10">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
                      style={{ background: "var(--color-surface)" }}
                    >
                      📍
                    </div>
                    <p
                      className="font-700 mb-1"
                      style={{ color: "var(--color-text)" }}
                    >
                      No saved addresses
                    </p>
                    <p
                      className="text-sm mb-4"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      Add an address for faster checkout
                    </p>
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="px-6 py-2.5 rounded-xl text-sm font-700 text-white transition-all"
                      style={{ background: "var(--color-primary)" }}
                    >
                      + Add Address
                    </button>
                  </div>
                )}

                {/* Address cards */}
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
                      <AddressCard
                        addr={addr}
                        onEdit={() => setEditAddress(addr)}
                        onDelete={() => {
                          if (window.confirm("Delete this address?"))
                            deleteAddress(addr.id);
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── App Theme ─────────────────────────────────────── */}
          <div
            className="rounded-3xl border overflow-hidden animate-fade-up"
            style={{
              background: "var(--color-bg-card)",
              borderColor: "var(--color-border)",
            }}
          >
            <div
              className="px-6 py-4 border-b flex items-center gap-2"
              style={{ borderColor: "var(--color-border)" }}
            >
              <span className="text-lg">🎨</span>
              <h2
                className="font-display text-lg font-700"
                style={{ color: "var(--color-text)" }}
              >
                App Theme
              </h2>
            </div>
            <div className="p-6 space-y-3">
              <p
                className="text-sm mb-4"
                style={{ color: "var(--color-text-muted)" }}
              >
                Saved independently per account
              </p>
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
                    {/* Color preview dots */}
                    <div className="flex gap-1">
                      {t.preview.map((color, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 rounded-full border"
                          style={{
                            background: color,
                            borderColor: "var(--color-border)",
                          }}
                        />
                      ))}
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span>{t.emoji}</span>
                        <p
                          className="font-700 text-sm"
                          style={{ color: "var(--color-text)" }}
                        >
                          {t.label}
                        </p>
                      </div>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {t.desc}
                      </p>
                    </div>
                  </div>
                  {/* Toggle switch */}
                  <div
                    className="w-12 h-6 rounded-full relative flex-shrink-0 transition-all duration-300"
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

          {/* ── Quick Links ───────────────────────────────────── */}
          <div
            className="rounded-3xl border overflow-hidden animate-fade-up"
            style={{
              background: "var(--color-bg-card)",
              borderColor: "var(--color-border)",
            }}
          >
            {[
              !isAdmin && {
                icon: "📦",
                label: "My Orders",
                sublabel: "Track your order history",
                to: "/orders",
              },
              !isAdmin && {
                icon: "🛒",
                label: "Cart",
                sublabel: "View items in your cart",
                to: "/cart",
              },
              isAdmin && {
                icon: "📊",
                label: "Dashboard",
                sublabel: "Manage restaurant",
                to: "/admin",
              },
            ]
              .filter((item): item is QuickLink => Boolean(item))
              .map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center justify-between px-6 py-4 border-b transition-all last:border-b-0"
                  style={{
                    borderColor: "var(--color-border)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--color-surface)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <p
                        className="text-sm font-700"
                        style={{ color: "var(--color-text)" }}
                      >
                        {item.label}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {item.sublabel}
                      </p>
                    </div>
                  </div>
                  <svg
                    className="w-4 h-4"
                    style={{ color: "var(--color-text-muted)" }}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
