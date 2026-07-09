import {defineType, defineField, defineArrayMember} from 'sanity'

export default defineType({
  name: 'instrumentCategory',
  title: 'Instrument Type',
  type: 'document',
  description: 'A shared instrument family (e.g. Igil, Jouhikko) with one reusable story/description used across all instruments of that type.',
  fields: [
    defineField({
      name: 'title',
      title: 'Name',
      type: 'string',
      description: 'e.g. "ProIgil", "Jouhikko", "Doshpuluur", "Air-Tunable Frame Drum", "Experimental Instrument"',
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
      name: 'description',
      title: 'Shared narrative description',
      type: 'array',
      description: 'The general story/craftsmanship text shared by every instrument of this type — e.g. what a Jouhikko is, what makes a ProIgil distinctive.',
      of: [defineArrayMember({type: 'block'})],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title'},
  },
})
