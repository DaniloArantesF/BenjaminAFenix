import { render, screen } from '@testing-library/react'
import user from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { mockTracks } from '../../mock/mockData';
import type { QProps } from './Queue';
import Queue from './Queue'
import store from '../../app/store';

const DEFAULT_PROPS: QProps = {
  items: mockTracks.map((track, index) => {
    return {itemPosition: index + 1, ...track}
  })
}


const renderComponent = (props = {}) => {
  return {
    ...render(
      <Provider store={store}>
        <Queue {...DEFAULT_PROPS} />
      </Provider>
    ),
    props: {
      ...DEFAULT_PROPS,
      ...props
    }
  }
};

describe('<Queue />', () => {
  test('shows correct items', () => {
    renderComponent();
    DEFAULT_PROPS.items.forEach(({ title }) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    })
  });

  // test('item is pushed correctly', () => {

  // });

  // test('item is pushed correctly', () => {

  // });
})





export { };