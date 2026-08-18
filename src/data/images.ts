const u = (id: string, w = 1800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const photos = {
  hero: u('photo-1581091226825-a6a2a5aee158'),
  studio: u('photo-1562564055-71e051d33c19'),
  showcaseHero: u('photo-1540575467063-178a50c2df87'),
  guided: u('photo-1498050108023-c5249f4df085'),
  craft: u('photo-1562157873-818bc0726f68'),
  experienceExterior: u('photo-1486406146926-c627a92ad1ab'),
  experiencePress: u('photo-1581092160562-40aa08e78837'),
  silkScreen: u('photo-1611532736597-de2d4265fba3'),
  tabs: {
    design: u('photo-1626785774573-4b799315345d'),
    signage: u('photo-1497366811353-6870744d04b2'),
    print: u('photo-1562564055-71e051d33c19'),
  },
};

/** Drop a replacement file at public/videos/hero.mp4 to swap the header video. */
export const heroVideo = '/videos/hero.mp4';

export { u };
