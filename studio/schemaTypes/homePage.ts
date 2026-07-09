import {defineType, defineField, defineArrayMember} from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  description: 'Singleton document — manages the two homepage photo carousels (Previous Works, Work in Progress). There should only ever be one of these.',
  fields: [
    defineField({
      name: 'previousWorks',
      title: 'Previous Works',
      type: 'array',
      description: 'Carousel of finished/past instrument photos. Drag to reorder, click "Add item" to add a new photo.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'galleryPhoto',
          fields: [
            defineField({name: 'image', title: 'Photo', type: 'image', options: {hotspot: true}, validation: (Rule) => Rule.required()}),
            defineField({name: 'caption', title: 'Caption (optional)', type: 'string'}),
          ],
          preview: {
            select: {title: 'caption', media: 'image'},
            prepare({title, media}) {
              return {title: title || 'Untitled photo', media}
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'workInProgress',
      title: 'Work in Progress',
      type: 'array',
      description: 'Carousel of in-progress/behind-the-scenes photos. Drag to reorder, click "Add item" to add a new photo.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'galleryPhoto',
          fields: [
            defineField({name: 'image', title: 'Photo', type: 'image', options: {hotspot: true}, validation: (Rule) => Rule.required()}),
            defineField({name: 'caption', title: 'Caption (optional)', type: 'string'}),
          ],
          preview: {
            select: {title: 'caption', media: 'image'},
            prepare({title, media}) {
              return {title: title || 'Untitled photo', media}
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Home Page (Previous Works & Work in Progress)'}
    },
  },
})
