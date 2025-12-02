<template>
  <div class="settings-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h2 class="section-title">Team Settings</h2>
        <p class="section-description">Manage team members and their permissions</p>
      </div>
      <UButton
        color="primary"
        size="lg"
        icon="i-heroicons-user-plus"
        @click="showInviteModal = true"
        class="invite-button"
      >
        Invite Team Member
      </UButton>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading team...</p>
    </div>

    <div v-else class="settings-grid">
      <!-- Active Members -->
      <UCard class="settings-card">
        <template #header>
          <div class="card-header">
            <div class="card-header-icon">
              <UIcon name="i-heroicons-user-group" class="icon" />
            </div>
            <div>
              <h3 class="card-title">Team Members</h3>
              <p class="card-description">
                {{ activeMembers.length }} active
                {{ activeMembers.length === 1 ? 'member' : 'members' }}
              </p>
            </div>
          </div>
        </template>

        <div class="card-content">
          <div v-if="activeMembers.length === 0" class="empty-state">
            <UIcon name="i-heroicons-user-group" class="empty-icon" />
            <p class="empty-text">No active team members</p>
          </div>

          <div v-else class="members-list">
            <div
              v-for="member in activeMembers"
              :key="member.id"
              class="member-item"
            >
              <div class="member-avatar">
                <div v-if="!member.avatar" class="avatar-placeholder">
                  {{ getInitials(member.name) }}
                </div>
                <img v-else :src="member.avatar" :alt="member.name" />
              </div>

              <div class="member-info">
                <h4 class="member-name">{{ member.name }}</h4>
                <p class="member-email">{{ member.email }}</p>
                <div class="member-meta">
                  <span class="meta-item">
                    <UIcon name="i-heroicons-calendar" class="meta-icon" />
                    Joined {{ formatDate(member.joinedAt) }}
                  </span>
                </div>
              </div>

              <div class="member-role">
                <div
                  class="role-badge"
                  :class="`role-${member.role}`"
                >
                  <UIcon :name="getRoleIcon(member.role)" class="role-icon" />
                  {{ capitalizeFirst(member.role) }}
                </div>
              </div>

              <div class="member-actions">
                <UButton
                  variant="ghost"
                  size="sm"
                  icon="i-heroicons-ellipsis-horizontal"
                  @click="showMemberMenu(member)"
                />
              </div>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Pending Invitations -->
      <UCard v-if="pendingMembers.length > 0" class="settings-card">
        <template #header>
          <div class="card-header">
            <div class="card-header-icon pending">
              <UIcon name="i-heroicons-clock" class="icon" />
            </div>
            <div>
              <h3 class="card-title">Pending Invitations</h3>
              <p class="card-description">
                {{ pendingMembers.length }} pending
                {{ pendingMembers.length === 1 ? 'invitation' : 'invitations' }}
              </p>
            </div>
          </div>
        </template>

        <div class="card-content">
          <div class="members-list">
            <div
              v-for="member in pendingMembers"
              :key="member.id"
              class="member-item pending"
            >
              <div class="member-avatar">
                <div class="avatar-placeholder pending">
                  {{ getInitials(member.name) }}
                </div>
              </div>

              <div class="member-info">
                <h4 class="member-name">{{ member.name }}</h4>
                <p class="member-email">{{ member.email }}</p>
                <div class="member-meta">
                  <span class="meta-item">
                    <UIcon name="i-heroicons-envelope" class="meta-icon" />
                    Invitation sent {{ formatDate(member.joinedAt) }}
                  </span>
                </div>
              </div>

              <div class="member-role">
                <div class="role-badge role-pending">
                  {{ capitalizeFirst(member.role) }}
                </div>
              </div>

              <div class="member-actions">
                <UButton
                  variant="ghost"
                  size="sm"
                  color="red"
                  @click="removeMember(member.id)"
                >
                  Revoke
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Roles & Permissions -->
      <UCard class="settings-card">
        <template #header>
          <div class="card-header">
            <div class="card-header-icon">
              <UIcon name="i-heroicons-shield-check" class="icon" />
            </div>
            <div>
              <h3 class="card-title">Roles & Permissions</h3>
              <p class="card-description">What each role can do</p>
            </div>
          </div>
        </template>

        <div class="card-content">
          <div class="roles-grid">
            <div
              v-for="role in roles"
              :key="role.value"
              class="role-card"
            >
              <div class="role-header">
                <div class="role-icon-wrapper" :class="`role-${role.value}`">
                  <UIcon :name="role.icon" class="icon" />
                </div>
                <div>
                  <h4 class="role-name">{{ role.name }}</h4>
                  <p class="role-description">{{ role.description }}</p>
                </div>
              </div>

              <ul class="permissions-list">
                <li v-for="(permission, index) in role.permissions" :key="index">
                  <UIcon name="i-heroicons-check" class="permission-icon" />
                  {{ permission }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Invite Member Modal -->
    <UModal v-model:open="showInviteModal">
      <UCard>
        <template #header>
          <h3 class="modal-title">Invite Team Member</h3>
        </template>

        <div class="modal-content">
          <UFormGroup label="Email Address" required>
            <UInput
              v-model="inviteForm.email"
              type="email"
              size="lg"
              placeholder="colleague@example.com"
              class="w-full"
            />
          </UFormGroup>

          <UFormGroup label="Role" required>
            <div class="role-select-options">
              <div
                v-for="role in roles"
                :key="role.value"
                class="role-select-option"
                :class="{ active: inviteForm.role === role.value }"
                @click="inviteForm.role = role.value"
              >
                <div class="option-radio">
                  <div v-if="inviteForm.role === role.value" class="radio-dot"></div>
                </div>
                <div class="option-icon" :class="`role-${role.value}`">
                  <UIcon :name="role.icon" class="icon" />
                </div>
                <div class="option-content">
                  <h4 class="option-name">{{ role.name }}</h4>
                  <p class="option-description">{{ role.description }}</p>
                </div>
              </div>
            </div>
          </UFormGroup>
        </div>

        <template #footer>
          <div class="modal-actions">
            <UButton variant="ghost" @click="showInviteModal = false">
              Cancel
            </UButton>
            <UButton
              color="primary"
              :loading="saving"
              :disabled="!inviteForm.email || !inviteForm.role"
              @click="handleInvite"
            >
              Send Invitation
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Remove Member Modal -->
    <UModal v-model:open="showRemoveModal">
      <UCard>
        <template #header>
          <div class="modal-header">
            <UIcon name="i-heroicons-exclamation-triangle" class="modal-icon" />
            <h3 class="modal-title">Remove Team Member?</h3>
          </div>
        </template>

        <div class="modal-content">
          <p class="modal-text">
            Are you sure you want to remove <strong>{{ selectedMember?.name }}</strong>
            from your team? They will immediately lose access to the dashboard.
          </p>
        </div>

        <template #footer>
          <div class="modal-actions">
            <UButton variant="ghost" @click="showRemoveModal = false">
              Cancel
            </UButton>
            <UButton
              color="red"
              :loading="saving"
              @click="confirmRemove"
            >
              Remove Member
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { TeamMember } from '~/composables/useSettings'

const { team, loading, saving, inviteTeamMember, removeTeamMember } = useSettings()

const showInviteModal = ref(false)
const showRemoveModal = ref(false)
const selectedMember = ref<TeamMember | null>(null)

const inviteForm = ref({
  email: '',
  role: 'staff' as TeamMember['role'],
})

const roles = [
  {
    value: 'admin',
    name: 'Admin',
    description: 'Full access to all settings and data',
    icon: 'i-heroicons-shield-exclamation',
    permissions: [
      'Manage all bookings and inventory',
      'Manage team members',
      'Access financial data',
      'Change all settings',
      'Delete data',
    ],
  },
  {
    value: 'manager',
    name: 'Manager',
    description: 'Manage bookings and inventory',
    icon: 'i-heroicons-clipboard-document-check',
    permissions: [
      'Manage bookings and inventory',
      'View customer data',
      'Generate reports',
      'Cannot manage team or billing',
    ],
  },
  {
    value: 'staff',
    name: 'Staff',
    description: 'View and update bookings',
    icon: 'i-heroicons-user',
    permissions: [
      'View bookings',
      'Update booking status',
      'View customer data',
      'Cannot change settings or manage inventory',
    ],
  },
]

const activeMembers = computed(() => {
  return team.value.filter((m) => m.status === 'active')
})

const pendingMembers = computed(() => {
  return team.value.filter((m) => m.status === 'pending')
})

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const getRoleIcon = (role: TeamMember['role']) => {
  const roleData = roles.find((r) => r.value === role)
  return roleData?.icon || 'i-heroicons-user'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const capitalizeFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const showMemberMenu = (member: TeamMember) => {
  selectedMember.value = member
  showRemoveModal.value = true
}

const handleInvite = async () => {
  try {
    await inviteTeamMember(inviteForm.value.email, inviteForm.value.role)
    showInviteModal.value = false
    inviteForm.value = { email: '', role: 'staff' }
  } catch (error) {
    console.error('Failed to invite team member:', error)
  }
}

const removeMember = async (memberId: string) => {
  try {
    await removeTeamMember(memberId)
  } catch (error) {
    console.error('Failed to remove team member:', error)
  }
}

const confirmRemove = async () => {
  if (selectedMember.value) {
    await removeMember(selectedMember.value.id)
    showRemoveModal.value = false
    selectedMember.value = null
  }
}
</script>

<style scoped>
.settings-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0 0 0.375rem;
  color: #ffffff;
}

.section-description {
  margin: 0;
  font-size: 0.9375rem;
  color: #888;
}

.invite-button {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border: none;
  color: #000;
  font-weight: 600;
  letter-spacing: -0.01em;
  transition: all 0.2s;
}

.invite-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 16px -4px rgba(251, 191, 36, 0.4);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
  color: #888;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(251, 191, 36, 0.1);
  border-top-color: #fbbf24;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.settings-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.settings-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.settings-card:hover {
  border-color: rgba(251, 191, 36, 0.2);
  box-shadow: 0 8px 32px -8px rgba(251, 191, 36, 0.15);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.card-header-icon {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: 0.625rem;
  color: #fbbf24;
  flex-shrink: 0;
}

.card-header-icon.pending {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: -0.015em;
  margin: 0 0 0.25rem;
  color: #ffffff;
}

.card-description {
  margin: 0;
  font-size: 0.875rem;
  color: #666;
}

.card-content {
  padding: 1.5rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  gap: 0.75rem;
}

.empty-icon {
  width: 3rem;
  height: 3rem;
  color: #333;
}

.empty-text {
  margin: 0;
  font-size: 0.9375rem;
  color: #666;
}

.members-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.member-item {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 0.75rem;
  transition: all 0.2s;
}

.member-item:hover {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.1);
}

.member-item.pending {
  opacity: 0.7;
}

.member-avatar {
  width: 3rem;
  height: 3rem;
  flex-shrink: 0;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border-radius: 0.625rem;
  color: #000;
  font-size: 0.9375rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.avatar-placeholder.pending {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: #fff;
}

.member-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.625rem;
}

.member-info {
  flex: 1;
  min-width: 0;
}

.member-name {
  font-size: 0.9375rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
  color: #ffffff;
}

.member-email {
  margin: 0 0 0.5rem;
  font-size: 0.875rem;
  color: #666;
}

.member-meta {
  display: flex;
  gap: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: #666;
}

.meta-icon {
  width: 0.875rem;
  height: 0.875rem;
}

.member-role {
  flex-shrink: 0;
}

.role-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
}

.role-badge.role-admin {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.role-badge.role-manager {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: #3b82f6;
}

.role-badge.role-staff {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #22c55e;
}

.role-badge.role-pending {
  background: rgba(102, 102, 102, 0.1);
  border: 1px solid rgba(102, 102, 102, 0.3);
  color: #666;
}

.role-icon {
  width: 1rem;
  height: 1rem;
}

.member-actions {
  flex-shrink: 0;
}

.roles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.role-card {
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.role-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.role-icon-wrapper {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  flex-shrink: 0;
}

.role-icon-wrapper.role-admin {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.role-icon-wrapper.role-manager {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: #3b82f6;
}

.role-icon-wrapper.role-staff {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #22c55e;
}

.role-name {
  font-size: 0.9375rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
  color: #ffffff;
}

.role-description {
  margin: 0;
  font-size: 0.875rem;
  color: #666;
  line-height: 1.4;
}

.permissions-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.permissions-list li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: #888;
  line-height: 1.4;
}

.permission-icon {
  width: 0.875rem;
  height: 0.875rem;
  color: #fbbf24;
  flex-shrink: 0;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: #ffffff;
}

.modal-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.role-select-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.role-select-option {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border: 2px solid rgba(255, 255, 255, 0.06);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.role-select-option:hover {
  border-color: rgba(251, 191, 36, 0.3);
  background: rgba(251, 191, 36, 0.03);
}

.role-select-option.active {
  border-color: rgba(251, 191, 36, 0.5);
  background: rgba(251, 191, 36, 0.08);
}

.option-radio {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 0.125rem;
  transition: all 0.2s;
}

.role-select-option.active .option-radio {
  border-color: #fbbf24;
}

.radio-dot {
  width: 10px;
  height: 10px;
  background: #fbbf24;
  border-radius: 50%;
}

.option-icon {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  flex-shrink: 0;
}

.option-icon.role-admin {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.option-icon.role-manager {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

.option-icon.role-staff {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.option-content {
  flex: 1;
}

.option-name {
  font-size: 0.9375rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
  color: #ffffff;
}

.option-description {
  margin: 0;
  font-size: 0.875rem;
  color: #888;
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.modal-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #fbbf24;
}

.modal-text {
  margin: 0;
  font-size: 0.9375rem;
  color: #888;
  line-height: 1.6;
}

.modal-text strong {
  color: #ffffff;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .member-item {
    flex-wrap: wrap;
  }

  .member-role {
    order: -1;
    width: 100%;
  }

  .roles-grid {
    grid-template-columns: 1fr;
  }
}
</style>
