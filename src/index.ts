import type { Core } from '@strapi/strapi';

const PROFILE_UID = 'api::profile.profile' as const;
const PROFILE_FIND_ACTION = 'api::profile.profile.find' as const;

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const publicRole = await strapi.db
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    if (publicRole) {
      const existingPerm = await strapi.db
        .query('plugin::users-permissions.permission')
        .findOne({
          where: { action: PROFILE_FIND_ACTION, role: { id: publicRole.id } },
        });

      if (!existingPerm) {
        await strapi.db.query('plugin::users-permissions.permission').create({
          data: {
            action: PROFILE_FIND_ACTION,
            role: publicRole.id,
          },
        });
      }
    }

    const existing = await strapi.documents(PROFILE_UID).findFirst({
      status: 'published',
    });

    if (existing) {
      return;
    }

    await strapi.documents(PROFILE_UID).create({
      data: {
        name: 'Heidi',
        info: "Hi I'm Heidi!",
        socialLinks: [
          {
            icon: 'instagram',
            label: 'Instagram',
            url: 'https://instagram.com',
          },
          {
            icon: 'medium',
            label: 'Medium',
            url: 'https://medium.com',
          },
          {
            icon: 'linkedin',
            label: 'Linkedin',
            url: 'https://linkedin.com',
          },
        ],
      },
      status: 'published',
    });
  },
};
