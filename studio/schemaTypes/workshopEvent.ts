import {defineType, defineField, defineArrayMember} from 'sanity'

export default defineType({
  name: 'workshopEvent',
  title: 'Workshop / Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          {title: 'Workshop', value: 'workshop'},
          {title: 'Event', value: 'event'},
          {title: 'Festival', value: 'festival'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover photo',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'additionalImages',
      title: 'Additional photos',
      type: 'array',
      of: [defineArrayMember({type: 'image', options: {hotspot: true}})],
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short teaser',
      type: 'text',
      rows: 2,
      description: 'Used for cards and meta description',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'description',
      title: 'Full description',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
    }),
    defineField({
      name: 'startDateTime',
      title: 'Start date/time',
      type: 'datetime',
      description: 'Leave blank if date is not yet confirmed (shows "Date TBD")',
    }),
    defineField({
      name: 'endDateTime',
      title: 'End date/time',
      type: 'datetime',
      description: 'Optional — for multi-day events',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Full address or venue name. Leave blank if not yet confirmed (shows "Location TBD")',
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
    }),
    defineField({
      name: 'capacity',
      title: 'Capacity',
      type: 'number',
      description: 'Workshops only, if limited spots',
    }),
    defineField({
      name: 'signUpLink',
      title: 'Sign-up / info link',
      type: 'url',
    }),
    defineField({
      name: 'order',
      title: 'Sort order',
      type: 'number',
      description: 'Optional manual override — otherwise sorted by date automatically',
    }),
  ],
  orderings: [
    {
      title: 'Date (upcoming first)',
      name: 'dateAsc',
      by: [{field: 'startDateTime', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'type',
      media: 'coverImage',
    },
  },
})
