/** Immersive services showcased along the scroll morph sequence. */

export type ImmersiveService = {
  id: string
  index: string
  title: string
  eyebrow: string
  body: string
  /** Shape this service is paired with in the morph track */
  shape: 'face' | 'dna' | 'arc' | 'bonsai'
  /** Which side the copy sits on for the camera ride */
  textSide: 'left' | 'right'
}

export const immersiveServices: ImmersiveService[] = [
  {
    id: 'ai-services',
    index: '01',
    title: 'AI Services',
    eyebrow: 'Smart Production',
    body: 'AI-assisted production workflows for brand and content programs — the machine as medium, the vision still human.',
    shape: 'face',
    textSide: 'right',
  },
  {
    id: 'augmented-reality',
    index: '02',
    title: 'Augmented Reality',
    eyebrow: 'Spatial Overlays',
    body: 'AR overlays that extend print and space into interactive layers — intent made visible in the room.',
    shape: 'dna',
    textSide: 'right',
  },
  {
    id: 'virtual-reality',
    index: '03',
    title: 'Virtual Reality',
    eyebrow: 'Immersive Worlds',
    body: 'VR environments for brand, training, and exhibition experiences built as living spatial systems.',
    shape: 'arc',
    textSide: 'right',
  },
  {
    id: 'mixed-reality',
    index: '04',
    title: 'Mixed Reality',
    eyebrow: 'Hybrid Experiences',
    body: 'Hybrid MR experiences combining physical installs with digital layers — form where worlds meet.',
    shape: 'bonsai',
    textSide: 'left',
  },
]
