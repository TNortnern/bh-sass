<template>
  <div class="max-w-5xl mx-auto">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200 dark:border-white/[0.06]">
      <div>
        <h2 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-1">Team Settings</h2>
        <p class="text-sm text-gray-600 dark:text-[#888]">Manage team members and their permissions</p>
      </div>
      <UButton
        color="primary"
        size="lg"
        icon="i-heroicons-user-plus"
        @click="showInviteModal = true"
        class="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-semibold shadow-lg hover:shadow-amber-500/25 transition-all duration-200"
      >
        Invite Team Member
      </UButton>
    </div>

    <div v-if="loading" class="flex flex-col items-center justify-center py-16 gap-4 text-gray-500 dark:text-[#888]">
      <div class="w-8 h-8 border-3 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
      <p>Loading team...</p>
    </div>

    <div v-else class="flex flex-col gap-6">
      <!-- Active Members -->
      <div class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:border-amber-300 dark:hover:border-amber-500/20 hover:shadow-lg hover:shadow-amber-500/5">
        <div class="px-6 py-4 border-b border-gray-100 dark:border-white/[0.06]">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 flex items-center justify-center bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl text-amber-600 dark:text-amber-400 flex-shrink-0">
              <UIcon name="i-heroicons-user-group" class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">Team Members</h3>
              <p class="text-sm text-gray-500 dark:text-[#666]">
                {{ activeMembers.length }} active
                {{ activeMembers.length === 1 ? 'member' : 'members' }}
              </p>
            </div>
          </div>
        </div>

        <div class="p-6">
          <div v-if="activeMembers.length === 0" class="flex flex-col items-center justify-center py-12 gap-3">
            <UIcon name="i-heroicons-user-group" class="w-12 h-12 text-gray-300 dark:text-[#333]" />
            <p class="text-sm text-gray-500 dark:text-[#666]">No active team members</p>
          </div>

          <div v-else class="flex flex-col gap-3">
            <div
              v-for="member in activeMembers"
              :key="member.id"
              class="flex items-center gap-5 p-5 bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.06] rounded-xl transition-all duration-200 hover:bg-gray-100 dark:hover:bg-white/[0.03] hover:border-gray-200 dark:hover:border-white/[0.1]"
            >
              <div class="w-12 h-12 flex-shrink-0">
                <div v-if="!member.avatar" class="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl text-black text-sm font-bold">
                  {{ getInitials(member.name) }}
                </div>
                <img v-else :src="member.avatar" :alt="member.name" class="w-full h-full object-cover rounded-xl" />
              </div>

              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">{{ member.name }}</h4>
                <p class="text-sm text-gray-500 dark:text-[#666] mb-1.5">{{ member.email }}</p>
                <div class="flex gap-4">
                  <span class="flex items-center gap-1.5 text-xs text-gray-400 dark:text-[#666]">
                    <UIcon name="i-heroicons-calendar" class="w-3.5 h-3.5" />
                    Joined {{ formatDate(member.joinedAt) }}
                  </span>
                </div>
              </div>

              <div class="flex-shrink-0">
                <div
                  class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold"
                  :class="{
                    'bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400': member.role === 'admin',
                    'bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400': member.role === 'manager',
                    'bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 text-green-600 dark:text-green-400': member.role === 'staff',
                  }"
                >
                  <UIcon :name="getRoleIcon(member.role)" class="w-4 h-4" />
                  {{ capitalizeFirst(member.role) }}
                </div>
              </div>

              <div class="flex-shrink-0">
                <UDropdown :items="getDropdownItems(member)">
                  <UButton
                    variant="ghost"
                    size="sm"
                    icon="i-heroicons-ellipsis-horizontal"
                  />
                </UDropdown>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pending Invitations -->
      <div v-if="pendingMembers.length > 0" class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 dark:border-white/[0.06]">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 flex items-center justify-center bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl text-blue-600 dark:text-blue-400 flex-shrink-0">
              <UIcon name="i-heroicons-clock" class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">Pending Invitations</h3>
              <p class="text-sm text-gray-500 dark:text-[#666]">
                {{ pendingMembers.length }} pending
                {{ pendingMembers.length === 1 ? 'invitation' : 'invitations' }}
              </p>
            </div>
          </div>
        </div>

        <div class="p-6">
          <div class="flex flex-col gap-3">
            <div
              v-for="member in pendingMembers"
              :key="member.id"
              class="flex items-center gap-5 p-5 bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.06] rounded-xl opacity-70"
            >
              <div class="w-12 h-12 flex-shrink-0">
                <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl text-white text-sm font-bold">
                  {{ getInitials(member.name) }}
                </div>
              </div>

              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">{{ member.name }}</h4>
                <p class="text-sm text-gray-500 dark:text-[#666] mb-1.5">{{ member.email }}</p>
                <div class="flex gap-4">
                  <span class="flex items-center gap-1.5 text-xs text-gray-400 dark:text-[#666]">
                    <UIcon name="i-heroicons-envelope" class="w-3.5 h-3.5" />
                    Invitation sent {{ formatDate(member.joinedAt) }}
                  </span>
                </div>
              </div>

              <div class="flex-shrink-0">
                <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold bg-gray-100 dark:bg-gray-500/10 border border-gray-200 dark:border-gray-500/30 text-gray-600 dark:text-gray-400">
                  {{ capitalizeFirst(member.role) }}
                </div>
              </div>

              <div class="flex-shrink-0">
                <UDropdown :items="getDropdownItems(member)">
                  <UButton
                    variant="ghost"
                    size="sm"
                    icon="i-heroicons-ellipsis-horizontal"
                  />
                </UDropdown>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Inactive Members -->
      <div v-if="inactiveMembers.length > 0" class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 dark:border-white/[0.06]">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-500/10 border border-gray-200 dark:border-gray-500/20 rounded-xl text-gray-500 dark:text-gray-400 flex-shrink-0">
              <UIcon name="i-heroicons-no-symbol" class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">Inactive Members</h3>
              <p class="text-sm text-gray-500 dark:text-[#666]">
                {{ inactiveMembers.length }} deactivated
                {{ inactiveMembers.length === 1 ? 'member' : 'members' }}
              </p>
            </div>
          </div>
        </div>

        <div class="p-6">
          <div class="flex flex-col gap-3">
            <div
              v-for="member in inactiveMembers"
              :key="member.id"
              class="flex items-center gap-5 p-5 bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.06] rounded-xl opacity-60"
            >
              <div class="w-12 h-12 flex-shrink-0">
                <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl text-white text-sm font-bold">
                  {{ getInitials(member.name) }}
                </div>
              </div>

              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">{{ member.name }}</h4>
                <p class="text-sm text-gray-500 dark:text-[#666] mb-1.5">{{ member.email }}</p>
                <div class="flex gap-4">
                  <span class="flex items-center gap-1.5 text-xs text-gray-400 dark:text-[#666]">
                    <UIcon name="i-heroicons-calendar" class="w-3.5 h-3.5" />
                    Joined {{ formatDate(member.joinedAt) }}
                  </span>
                </div>
              </div>

              <div class="flex-shrink-0">
                <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold bg-gray-100 dark:bg-gray-500/10 border border-gray-200 dark:border-gray-500/30 text-gray-500 dark:text-gray-400">
                  {{ capitalizeFirst(member.role) }}
                </div>
              </div>

              <div class="flex-shrink-0">
                <UDropdown :items="getDropdownItems(member)">
                  <UButton
                    variant="ghost"
                    size="sm"
                    icon="i-heroicons-ellipsis-horizontal"
                  />
                </UDropdown>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Roles & Permissions -->
      <div class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 dark:border-white/[0.06]">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 flex items-center justify-center bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl text-amber-600 dark:text-amber-400 flex-shrink-0">
              <UIcon name="i-heroicons-shield-check" class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">Roles & Permissions</h3>
              <p class="text-sm text-gray-500 dark:text-[#666]">What each role can do</p>
            </div>
          </div>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              v-for="role in roles"
              :key="role.value"
              class="p-5 bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.06] rounded-xl flex flex-col gap-4"
            >
              <div class="flex items-start gap-4">
                <div
                  class="w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0"
                  :class="{
                    'bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400': role.value === 'admin',
                    'bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400': role.value === 'manager',
                    'bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 text-green-600 dark:text-green-400': role.value === 'staff',
                  }"
                >
                  <UIcon :name="role.icon" class="w-5 h-5" />
                </div>
                <div>
                  <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">{{ role.name }}</h4>
                  <p class="text-xs text-gray-500 dark:text-[#666] leading-relaxed">{{ role.description }}</p>
                </div>
              </div>

              <ul class="flex flex-col gap-2 mt-auto">
                <li v-for="(permission, index) in role.permissions" :key="index" class="flex items-center gap-2 text-xs text-gray-600 dark:text-[#888] leading-relaxed">
                  <UIcon name="i-heroicons-check" class="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  {{ permission }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Invite Member Modal -->
    <UModal v-model:open="showInviteModal">
      <template #content>
        <div class="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100 dark:border-white/[0.06]">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Invite Team Member</h3>
          </div>

          <div class="p-6 flex flex-col gap-6">
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
              <div class="flex flex-col gap-3 mt-2">
                <div
                  v-for="role in roles"
                  :key="role.value"
                  class="flex items-start gap-4 p-4 bg-gray-50 dark:bg-white/[0.02] border-2 rounded-xl cursor-pointer transition-all duration-200"
                  :class="inviteForm.role === role.value ? 'border-amber-400 dark:border-amber-500/50 bg-amber-50 dark:bg-amber-500/5' : 'border-gray-100 dark:border-white/[0.06] hover:border-amber-200 dark:hover:border-amber-500/30'"
                  @click="inviteForm.role = role.value"
                >
                  <div class="w-5 h-5 mt-0.5 border-2 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                    :class="inviteForm.role === role.value ? 'border-amber-500' : 'border-gray-300 dark:border-white/20'"
                  >
                    <div v-if="inviteForm.role === role.value" class="w-2.5 h-2.5 bg-amber-500 rounded-full"></div>
                  </div>
                  <div
                    class="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0"
                    :class="{
                      'bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400': role.value === 'admin',
                      'bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400': role.value === 'manager',
                      'bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-600 dark:text-green-400': role.value === 'staff',
                    }"
                  >
                    <UIcon :name="role.icon" class="w-4 h-4" />
                  </div>
                  <div class="flex-1">
                    <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">{{ role.name }}</h4>
                    <p class="text-xs text-gray-500 dark:text-[#888]">{{ role.description }}</p>
                  </div>
                </div>
              </div>
            </UFormGroup>
          </div>

          <div class="px-6 py-4 border-t border-gray-100 dark:border-white/[0.06] flex justify-end gap-3">
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
        </div>
      </template>
    </UModal>

    <!-- Edit Role Modal -->
    <UModal v-model:open="showEditRoleModal">
      <template #content>
        <div class="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100 dark:border-white/[0.06]">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Edit Team Member Role</h3>
          </div>

          <div class="p-6 flex flex-col gap-6">
            <div class="mb-2">
              <p class="text-xs text-gray-500 dark:text-[#666] mb-1">Team Member</p>
              <p class="font-semibold text-gray-900 dark:text-white">{{ selectedMember?.name }}</p>
              <p class="text-sm text-gray-500 dark:text-[#666]">{{ selectedMember?.email }}</p>
            </div>

            <UFormGroup label="Role" required>
              <div class="flex flex-col gap-3 mt-2">
                <div
                  v-for="role in roles"
                  :key="role.value"
                  class="flex items-start gap-4 p-4 bg-gray-50 dark:bg-white/[0.02] border-2 rounded-xl cursor-pointer transition-all duration-200"
                  :class="editRoleForm === role.value ? 'border-amber-400 dark:border-amber-500/50 bg-amber-50 dark:bg-amber-500/5' : 'border-gray-100 dark:border-white/[0.06] hover:border-amber-200 dark:hover:border-amber-500/30'"
                  @click="editRoleForm = role.value"
                >
                  <div class="w-5 h-5 mt-0.5 border-2 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                    :class="editRoleForm === role.value ? 'border-amber-500' : 'border-gray-300 dark:border-white/20'"
                  >
                    <div v-if="editRoleForm === role.value" class="w-2.5 h-2.5 bg-amber-500 rounded-full"></div>
                  </div>
                  <div
                    class="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0"
                    :class="{
                      'bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400': role.value === 'admin',
                      'bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400': role.value === 'manager',
                      'bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-600 dark:text-green-400': role.value === 'staff',
                    }"
                  >
                    <UIcon :name="role.icon" class="w-4 h-4" />
                  </div>
                  <div class="flex-1">
                    <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">{{ role.name }}</h4>
                    <p class="text-xs text-gray-500 dark:text-[#888]">{{ role.description }}</p>
                  </div>
                </div>
              </div>
            </UFormGroup>
          </div>

          <div class="px-6 py-4 border-t border-gray-100 dark:border-white/[0.06] flex justify-end gap-3">
            <UButton variant="ghost" @click="showEditRoleModal = false">
              Cancel
            </UButton>
            <UButton
              color="primary"
              :loading="saving"
              @click="saveEditedRole"
            >
              Update Role
            </UButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Deactivate Member Modal -->
    <UModal v-model:open="showDeactivateModal">
      <template #content>
        <div class="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100 dark:border-white/[0.06]">
            <div class="flex items-center gap-3">
              <UIcon name="i-heroicons-no-symbol" class="w-6 h-6 text-amber-500" />
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Deactivate Team Member?</h3>
            </div>
          </div>

          <div class="p-6">
            <p class="text-sm text-gray-600 dark:text-[#888] leading-relaxed">
              Are you sure you want to deactivate <strong class="text-gray-900 dark:text-white">{{ selectedMember?.name }}</strong>?
              They will lose access to the dashboard but their account will be preserved.
            </p>
          </div>

          <div class="px-6 py-4 border-t border-gray-100 dark:border-white/[0.06] flex justify-end gap-3">
            <UButton variant="ghost" @click="showDeactivateModal = false">
              Cancel
            </UButton>
            <UButton
              color="warning"
              :loading="saving"
              @click="confirmDeactivate"
            >
              Deactivate Member
            </UButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Remove Member Modal -->
    <UModal v-model:open="showRemoveModal">
      <template #content>
        <div class="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100 dark:border-white/[0.06]">
            <div class="flex items-center gap-3">
              <UIcon name="i-heroicons-exclamation-triangle" class="w-6 h-6 text-red-500" />
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Remove Team Member?</h3>
            </div>
          </div>

          <div class="p-6">
            <p class="text-sm text-gray-600 dark:text-[#888] leading-relaxed">
              Are you sure you want to remove <strong class="text-gray-900 dark:text-white">{{ selectedMember?.name }}</strong>
              from your team? They will immediately lose access to the dashboard.
            </p>
          </div>

          <div class="px-6 py-4 border-t border-gray-100 dark:border-white/[0.06] flex justify-end gap-3">
            <UButton variant="ghost" @click="showRemoveModal = false">
              Cancel
            </UButton>
            <UButton
              color="error"
              :loading="saving"
              @click="confirmRemove"
            >
              Remove Member
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { TeamMember } from '~/composables/useSettings'

const { team, loading, saving, inviteTeamMember, removeTeamMember, deactivateTeamMember, reactivateTeamMember, resendInvitation: resendInvitationFn, updateTeamMemberRole } = useSettings()

const showInviteModal = ref(false)
const showRemoveModal = ref(false)
const showEditRoleModal = ref(false)
const showDeactivateModal = ref(false)
const selectedMember = ref<TeamMember | null>(null)
const editRoleForm = ref<TeamMember['role']>('staff')

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

const inactiveMembers = computed(() => {
  return team.value.filter((m) => m.status === 'inactive')
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

const getDropdownItems = (member: TeamMember) => {
  const items = []

  if (member.status === 'active') {
    items.push({
      label: 'Edit Role',
      icon: 'i-heroicons-pencil-square',
      click: () => openEditRoleModal(member),
    })
    items.push({
      label: 'Deactivate',
      icon: 'i-heroicons-no-symbol',
      click: () => openDeactivateModal(member),
    })
  }

  if (member.status === 'inactive') {
    items.push({
      label: 'Reactivate',
      icon: 'i-heroicons-check-circle',
      click: () => handleReactivate(member),
    })
    items.push({
      label: 'Edit Role',
      icon: 'i-heroicons-pencil-square',
      click: () => openEditRoleModal(member),
    })
  }

  if (member.status === 'pending') {
    items.push({
      label: 'Resend Invitation',
      icon: 'i-heroicons-paper-airplane',
      click: () => resendInvitation(member),
    })
  }

  items.push({
    label: 'Delete',
    icon: 'i-heroicons-trash',
    click: () => openRemoveModal(member),
  })

  return [items]
}

const handleReactivate = async (member: TeamMember) => {
  try {
    await reactivateTeamMember(member.id)
  } catch (error) {
    console.error('Failed to reactivate member:', error)
  }
}

const openEditRoleModal = (member: TeamMember) => {
  selectedMember.value = member
  editRoleForm.value = member.role
  showEditRoleModal.value = true
}

const openDeactivateModal = (member: TeamMember) => {
  selectedMember.value = member
  showDeactivateModal.value = true
}

const openRemoveModal = (member: TeamMember) => {
  selectedMember.value = member
  showRemoveModal.value = true
}

const resendInvitation = async (member: TeamMember) => {
  try {
    await resendInvitationFn(member.id)
  } catch (error) {
    console.error('Failed to resend invitation:', error)
  }
}

const saveEditedRole = async () => {
  if (!selectedMember.value) return

  try {
    await updateTeamMemberRole(selectedMember.value.id, editRoleForm.value)
    showEditRoleModal.value = false
    selectedMember.value = null
  } catch (error) {
    console.error('Failed to update role:', error)
  }
}

const confirmDeactivate = async () => {
  if (!selectedMember.value) return

  try {
    await deactivateTeamMember(selectedMember.value.id)
    showDeactivateModal.value = false
    selectedMember.value = null
  } catch (error) {
    console.error('Failed to deactivate member:', error)
  }
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
