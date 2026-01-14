import { createServerFn } from '@tanstack/react-start'
import { getAllCandidates as _getAllCandidates, getCandidateBySlug as _getCandidateBySlug } from './candidate-data.server'

export const getAllCandidates = createServerFn({ method: 'GET' }).handler(async () => {
  return _getAllCandidates()
})

export const getCandidateBySlug = createServerFn({ method: 'GET' })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    return _getCandidateBySlug(data.slug)
  })
