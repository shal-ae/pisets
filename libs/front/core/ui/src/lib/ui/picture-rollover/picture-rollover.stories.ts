import { argsToTemplate, Meta, StoryObj } from '@storybook/angular'
import { PictureRolloverComponent } from './picture-rollover.component'

const meta: Meta<PictureRolloverComponent> = {
  title: 'PictureRolloverComponent',
  component: PictureRolloverComponent,
  excludeStories: /.*Data$/,
  tags: [ 'autodocs' ],

  render: ( args ) => ({
    props: {
      ...args,
    },
    template: `<div><lib-picture-rollover ${argsToTemplate( args )}/></div>`,
    args: {},
  }),
}

export default meta
type Story = StoryObj<PictureRolloverComponent>;

export const Default: Story = {
  args: {
    pictures: [
      {
        path: 'https://cat.rk-a.ru/files/catalog/4/th/400/02/38/02387f4dbd88ff10ebd4e85a66aee5cc.jpg',
      },
      {
        path: 'https://cat.rk-a.ru/files/catalog/4/th/400/7e/92/7e92444c7cb165d17551b2a53b1ab015.jpg',
      },
      {
        path: 'https://cat.rk-a.ru/files/catalog/4/th/400/f5/23/f52338a32c4e3d67b936455a98539855.jpg',
      },
      {
        path: 'https://cat.rk-a.ru/files/catalog/4/th/400/c9/c1/c9c1a9c3679c918f521095248cb06ced.jpg',
      },
      {
        path: 'https://cat.rk-a.ru/files/catalog/4/th/400/f0/ef/f0efd030501ddc5d855599ac94ac0885.jpg',
      },
      {
        path: 'https://cat.rk-a.ru/files/catalog/4/th/400/23/66/2366108ee68d74176a3a8b62cb7b13bb.jpg',
      },
      {
        path: 'https://cat.rk-a.ru/files/catalog/4/th/400/3e/a7/3ea741a078865d3d10fe48a804342e2d.jpg',
      },
      {
        path: 'https://cat.rk-a.ru/files/catalog/4/th/400/6c/eb/6cebea49f2f7c956d2d368d81cd8d587.jpg',
      },
    ],
  },
}
