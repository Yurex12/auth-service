import { db } from '../db/index.js';
import {
  permissionsTable,
  rolePermissionsTable,
  rolesTable,
} from '../db/schema.js';

const rolesData = [{ name: 'user' }, { name: 'admin' }];

const permissionsData = [
  { name: 'users:read' },
  { name: 'users:update' },
  { name: 'users:delete' },
  { name: 'users:role:update' },
  { name: 'posts:create' },
  { name: 'posts:read' },
  { name: 'posts:update' },
  { name: 'posts:delete' },
];

async function main() {
  await db.transaction(async (tx) => {
    await tx
      .insert(rolesTable)
      .values(rolesData)
      .onConflictDoNothing({ target: rolesTable.name });

    const roles = await tx.query.rolesTable.findMany();

    const rolesMap = new Map<string, string>();

    roles.forEach((role) => rolesMap.set(role.name, role.id));

    await tx
      .insert(permissionsTable)
      .values(permissionsData)
      .onConflictDoNothing({ target: permissionsTable.name });

    const permissions = await tx.query.permissionsTable.findMany();

    const permissionsMap = new Map<string, string>();

    permissions.forEach((permission) =>
      permissionsMap.set(permission.name, permission.id),
    );

    const userRoleId = rolesMap.get('user');
    const adminRoleId = rolesMap.get('admin');

    const postsCreateId = permissionsMap.get('posts:create');
    const postsReadId = permissionsMap.get('posts:read');
    const postsUpdateId = permissionsMap.get('posts:update');
    const postsDeleteId = permissionsMap.get('posts:delete');
    const usersReadId = permissionsMap.get('users:read');
    const usersUpdateId = permissionsMap.get('users:update');
    const usersRoleUpdateId = permissionsMap.get('users:role:update');
    const usersDeleteId = permissionsMap.get('users:delete');

    if (
      !userRoleId ||
      !adminRoleId ||
      !postsCreateId ||
      !postsReadId ||
      !postsUpdateId ||
      !postsDeleteId ||
      !usersReadId ||
      !usersUpdateId ||
      !usersRoleUpdateId ||
      !usersDeleteId
    ) {
      throw new Error('Required RBAC seed data not found');
    }

    const rolePermissionsData = [
      {
        roleId: userRoleId,
        permissionId: postsCreateId,
      },
      {
        roleId: userRoleId,
        permissionId: postsReadId,
      },
      {
        roleId: adminRoleId,
        permissionId: postsReadId,
      },
      {
        roleId: adminRoleId,
        permissionId: postsCreateId,
      },
      {
        roleId: adminRoleId,
        permissionId: postsUpdateId,
      },
      {
        roleId: adminRoleId,
        permissionId: postsDeleteId,
      },
      {
        roleId: adminRoleId,
        permissionId: usersReadId,
      },
      {
        roleId: adminRoleId,
        permissionId: usersDeleteId,
      },
      {
        roleId: adminRoleId,
        permissionId: usersUpdateId,
      },
      {
        roleId: adminRoleId,
        permissionId: usersRoleUpdateId,
      },
    ];

    await tx
      .insert(rolePermissionsTable)
      .values(rolePermissionsData)
      .onConflictDoNothing({
        target: [
          rolePermissionsTable.roleId,
          rolePermissionsTable.permissionId,
        ],
      });
  });
}

main()
  .then(() => {
    console.log('Database seeded successfully.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
