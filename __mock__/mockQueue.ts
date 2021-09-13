const Item = (index: number) => {
  return {
    itemPosition: index + 1,
    author: `Author ${index + 1}`,
    duration: 193000,
    title: `Track ${index + 1}`,
    id: 'dQw4w9WgXcQ',
    user: 'gepeto420',
    service: 1,
  };
};
const getItems = (length: number) => {
  const items = [];
  for (let i = 0; i < length; i++) {
    items.push(Item(i));
  }
  return items;
}

export const initialQueue = {
  items: [],
  position: -1,
};

export const overflowingQueue = {
  items: [...getItems(10)],
  position: 0,
};

export const pushOverflowingInput = {
  author: `Author 9`,
  duration: 193000,
  title: `Track 9`,
  id: 'dQw4w9WgXcQ',
  user: 'gepeto420',
  service: 1,
};

export const pushOverflowingExpected = {
  items: [...getItems(11)],
  position: 0,
}

export default {
  items: [...getItems(3)],
  position: 0,
};

export const pushInput = {
  author: `Author 4`,
  duration: 193000,
  title: `Track 4`,
  id: 'dQw4w9WgXcQ',
  user: 'gepeto420',
  service: 1,
}

export const pushExpected = {
  items: [...getItems(4)],
  position: 0,
}