import { action } from '@storybook/addon-actions'
import { argsToTemplate, Meta, StoryObj } from '@storybook/angular'
import { ResizerComponent } from './resizer.component'

const meta: Meta<ResizerComponent> = {
  title: 'Resizer',
  component: ResizerComponent,
  excludeStories: /.*Data$/,
  tags: [ 'autodocs' ],

  render: ( args ) => ({
    props: {
      ...args,
      rect: args.rect,
    },
    template: `<lib-resizer ${argsToTemplate( args )}><div style="height: 100%; width: 100%; background-color: #18ffe0;"></div></lib-resizer>`,
    args: {
      rect: {
        left: 5,
        top: 5,
        width: 80,
        height: 40,
      },
      dragRestriction: undefined,
      onDragStared: action( 'onDragStared' ),
      onDragEnded: action( 'onDragEnded' ),
      onDragging: action( 'onDragging' ),
    },
  }),
}

export default meta

type Story = StoryObj<ResizerComponent>;

export const Default: Story = {
  args: {
    rect: {
      left: 5,
      top: 5,
      width: 80,
      height: 40,
    },

    showPositionCaption: false,
  },
}
