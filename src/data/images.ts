const u = (id: string, w = 1800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const photos = {
  hero: u('photo-1600607687939-ce8a6c25118c'),
  studio: u('photo-1581091226825-a6a2a5aee158'),
  showcaseHero: u('photo-1497366216548-37526070297c'),
  guided: u('photo-1544244015-0df4b3ffc6b0'),
  craft: u('photo-1581092160562-40aa08e78837'),
  experienceExterior: u('photo-1486406146926-c627a92ad1ab'),
  experiencePress: u('photo-1562564055-71e051d33c19'),
  silkScreen: u('photo-1562157873-818bc0726f68'),
  tabs: {
    design: u('photo-1561070791-2526d30994b5'),
    signage: u('photo-1517248135467-4c7edcad34c4'),
    print: u('photo-1581092160607-ee22621dd758'),
  },
};

/** Drop a replacement file at public/videos/hero.mp4 to swap the header video. */
export const heroVideo = '/videos/hero.mp4';

export { u };
