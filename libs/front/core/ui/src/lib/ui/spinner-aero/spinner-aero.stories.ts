import { argsToTemplate, Meta, StoryObj } from '@storybook/angular'
import { SpinnerAeroComponent } from './spinner-aero.component'

const meta: Meta<SpinnerAeroComponent> = {
  title: 'SpinnerAero',
  component: SpinnerAeroComponent,
  excludeStories: /.*Data$/,
  tags: [ 'autodocs' ],

  render: ( args ) => ({
    props: {
      ...args,
    },
    template: `<lib-spinner-aero ${argsToTemplate( args )}/>`,
    args: {},
  }),
}

export default meta
type Story = StoryObj<SpinnerAeroComponent>;

export const Default: Story = {
  args: {},
}
