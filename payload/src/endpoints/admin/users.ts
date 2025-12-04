import type { Endpoint } from 'payload'

/**
 * GET /api/admin/users
 * List all users across all tenants
 */
export const adminUsersListEndpoint: Endpoint = {
  path: '/admin/users',
  method: 'get',
  handler: async (req) => {
    const { payload, user } = req

    // Super admin only
    if (!user || user.role !== 'super_admin') {
      return Response.json(
        { error: 'Unauthorized - Super admin access required' },
        { status: 403 }
      )
    }

    try {
      const url = new URL(req.url || '')
      const search = url.searchParams.get('search') || ''
      const role = url.searchParams.get('role') || ''
      const status = url.searchParams.get('status') || ''

      // Build where clause
      const where: any = {}

      if (search) {
        where.or = [
          { email: { contains: search } },
          { 'profile.firstName': { contains: search } },
          { 'profile.lastName': { contains: search } }
        ]
      }

      if (role) {
        where.role = { equals: role }
      }

      if (status === 'active') {
        where.isActive = { equals: true }
      } else if (status === 'inactive') {
        where.isActive = { equals: false }
      }

      const usersResult = await payload.find({
        collection: 'users',
        where,
        limit: 100,
        sort: '-createdAt',
        depth: 2 // Populate tenant relationship
      })

      // Format users for response
      const formattedUsers = usersResult.docs.map((u: any) => ({
        id: String(u.id),
        email: u.email,
        role: u.role,
        tenantId: u.tenantId ? String(u.tenantId) : undefined,
        tenantName: typeof u.tenantId === 'object' && u.tenantId ? u.tenantId.name : undefined,
        firstName: u.profile?.firstName,
        lastName: u.profile?.lastName,
        isActive: u.isActive ?? true,
        createdAt: u.createdAt,
        lastLoginAt: u.lastLoginAt
      }))

      return Response.json(formattedUsers)
    } catch (error: any) {
      req.payload.logger.error('Error fetching users:', error)
      return Response.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      )
    }
  }
}

/**
 * POST /api/admin/users/:id/status
 * Activate or deactivate a user
 */
export const adminUserStatusEndpoint: Endpoint = {
  path: '/admin/users/:id/status',
  method: 'post',
  handler: async (req) => {
    const { payload, user } = req

    // Super admin only
    if (!user || user.role !== 'super_admin') {
      return Response.json(
        { error: 'Unauthorized - Super admin access required' },
        { status: 403 }
      )
    }

    try {
      const userId = req.routeParams?.id
      const body = req.json ? await req.json() : {}
      const isActive = body?.isActive

      if (!userId) {
        return Response.json(
          { error: 'User ID is required' },
          { status: 400 }
        )
      }

      if (typeof isActive !== 'boolean') {
        return Response.json(
          { error: 'isActive must be a boolean' },
          { status: 400 }
        )
      }

      const updatedUser = await payload.update({
        collection: 'users',
        id: String(userId),
        data: {
          isActive
        }
      })

      // Log action
      await payload.create({
        collection: 'audit-logs',
        data: {
          action: 'api_call' as const,
          collection: 'users',
          documentId: String(userId),
          userId: user.id,
          metadata: {
            details: `Super admin ${user.email} ${isActive ? 'activated' : 'deactivated'} user ${updatedUser.email}`,
            ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
            userAgent: req.headers.get('user-agent') || 'unknown'
          },
          timestamp: new Date().toISOString()
        }
      })

      return Response.json({
        success: true,
        user: updatedUser
      })
    } catch (error: any) {
      req.payload.logger.error('Error updating user status:', error)
      return Response.json(
        { error: 'Failed to update user status' },
        { status: 500 }
      )
    }
  }
}
