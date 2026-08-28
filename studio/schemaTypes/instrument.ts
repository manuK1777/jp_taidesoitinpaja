import {defineType, defineField, defineArrayMember} from 'sanity'

export default defineType({
  name: 'instrument',
  title: 'Instrument',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'instrumentType',
      title: 'Instrument type',
      type: 'reference',
      to: [{type: 'instrumentCategory'}],
      description: 'The instrument family this belongs to — carries the shared story/description (e.g. what a Jouhikko is).',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'badge',
      title: 'Badge',
      type: 'string',
      description: 'Optional tag shown on the instrument card, e.g. "New Arrival", "Special Edition"',
      validation: (Rule) => Rule.max(24).warning('Keep badges short so they fit the card layout'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Photos',
      type: 'array',
      of: [defineArrayMember({type: 'image', options: {hotspot: true}})],
      validation: (Rule) => Rule.required().min(1),
    }),
   defineField({
  name: 'videos',
  title: 'Videos (optional)',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'object',
      name: 'videoItem',
      title: 'Video',
      fields: [
        defineField({
          name: 'video',
          title: 'Video File',
          type: 'file',
          options: {accept: 'video/*'},
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'poster',
          title: 'Poster Image',
          type: 'image',
          description: 'Still frame shown before this video plays.',
          options: {hotspot: true},
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'description',
          title: 'Video Description',
          type: 'string',
          description: 'What this video demonstrates, e.g. "J-P playing the igil, showing its resonant low tone." Used as the visible caption and read by screen readers.',
          validation: (Rule) => Rule.required().min(10),
        }),
      ],
      preview: {
        select: {title: 'description', media: 'poster'},
        prepare({title, media}) {
          return {title: title || 'Video', media}
        },
      },
    }),
  ],
}),
    defineField({
      name: 'shortDescription',
      title: 'Short description',
      type: 'text',
      rows: 2,
      description: 'Used in gallery/card view',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'description',
      title: "This instrument's unique details",
      type: 'array',
      description: 'Only what\'s unique to THIS specific instrument (beyond the shared type story) — e.g. a special edition note, a one-off detail.',
      of: [defineArrayMember({type: 'block'})],
    }),
    defineField({
      name: 'specifications',
      title: 'Specifications',
      type: 'array',
      description: 'Add as many rows as needed, e.g. "Body: birch", "Strings: 3, horsehair"',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'specItem',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string'}),
            defineField({name: 'value', title: 'Value', type: 'string'}),
          ],
          preview: {
            select: {title: 'label', subtitle: 'value'},
          },
        }),
      ],
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      description: 'Leave blank to show "Contact for price"',
    }),
    defineField({
      name: 'availability',
      title: 'Availability',
      type: 'string',
      options: {
        list: [
          {title: 'In stock', value: 'in-stock'},
          {title: 'Sold', value: 'sold'},
          {title: 'Made to order', value: 'made-to-order'},
        ],
        layout: 'radio',
      },
      initialValue: 'in-stock',
    }),
    defineField({
      name: 'order',
      title: 'Sort order',
      type: 'number',
      description: 'Optional manual sort override for the gallery',
    }),
  ],
  orderings: [
    {
      title: 'Manual order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'instrumentType.title',
      media: 'images.0',
    },
  },
})
