/** Immersive services showcased along the scroll morph sequence. */

export type ImmersiveService = {
  id: string
  index: string
  title: string
  eyebrow: string
  /** One concrete sentence for the scroll panel, what it is, not what it evokes */
  body: string
  /** What a client actually receives */
  deliverables: string[]
  /** A real situation this gets bought for */
  useCase: string
  /** Where it attaches to work already leaving the factory */
  floorLink: string
  /** Shape this service is paired with in the morph track */
  shape: 'face' | 'holo' | 'quest' | 'bonsai'
  /** Which side the copy sits on for the camera ride */
  textSide: 'left' | 'right'
}

export const immersiveServices: ImmersiveService[] = [
  {
    id: 'ai-services',
    index: '01',
    title: 'AI Services',
    eyebrow: 'Smart Production',
    body: 'We use AI to take the slow, repetitive work out of large campaigns, resizing, adapting, and versioning artwork across hundreds of items without redrawing each one by hand.',
    deliverables: [
      'Bulk artwork adaptation across sizes and formats',
      'Product and packaging visuals generated from existing assets',
      'Arabic and English versioning kept on-brand',
      'Retouching and cleanup at catalogue volume',
    ],
    useCase:
      'A retail rollout needs one campaign resized for 40 store formats, two languages, and a print deadline. AI does the versioning; our designers approve every file before it reaches the press.',
    floorLink: 'Output lands as press-ready artwork on the same offset and digital lines we already run.',
    shape: 'face',
    textSide: 'right',
  },
  {
    id: 'augmented-reality',
    index: '02',
    title: 'Augmented Reality',
    eyebrow: 'Spatial Overlays',
    body: 'We add a scannable digital layer to printed and installed work, packs, brochures, and signage that open a video, a spec sheet, or a 3D model when a phone points at them.',
    deliverables: [
      'Marker and QR-triggered AR built into printed artwork',
      'Web-based AR that runs in the browser, no app install',
      '3D product previews for packaging and equipment',
      'Analytics on scans, location, and dwell time',
    ],
    useCase:
      'An industrial supplier ships equipment with a printed manual nobody opens. The same panel, scanned, plays the install sequence in 3D on the technician\'s phone.',
    floorLink: 'The trigger is printed by us, so the artwork and the AR are tested together before the run.',
    shape: 'holo',
    textSide: 'left',
  },
  {
    id: 'virtual-reality',
    index: '03',
    title: 'Virtual Reality',
    eyebrow: 'Immersive Worlds',
    body: 'We build walkthrough environments for spaces that do not exist yet, or cannot be visited, stands, showrooms, and plant areas your team can review in a headset before anything is fabricated.',
    deliverables: [
      'Walkthrough builds of stands, showrooms, and interiors',
      'Headset and desktop versions from one model',
      'Safety and process training scenarios',
      'Client review sessions with changes applied live',
    ],
    useCase:
      'A brand signs off an exhibition stand in VR, moves a wall and two displays while in the model, and avoids finding the problem on-site during build week.',
    floorLink: 'The approved model becomes the build drawing for our own fabrication and install crews.',
    shape: 'quest',
    textSide: 'right',
  },
  {
    id: 'mixed-reality',
    index: '04',
    title: 'Mixed Reality',
    eyebrow: 'Hybrid Experiences',
    body: 'We combine something physically built with a digital layer running on top of it, a real stand, wall, or product with projection, sensors, or tracked content responding to the people in front of it.',
    deliverables: [
      'Interactive installations for events, lobbies, and showrooms',
      'Projection and screen content mapped to a built structure',
      'Motion and touch triggers wired into the physical build',
      'On-site setup, testing, and event-day support',
    ],
    useCase:
      'A launch event needs more than a banner. We fabricate the structure, map content to its exact surfaces, and staff it for the three days it runs.',
    floorLink: 'One team fabricates the structure and builds the digital layer, so the two actually fit.',
    shape: 'bonsai',
    textSide: 'left',
  },
]
