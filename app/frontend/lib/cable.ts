import { createConsumer } from '@rails/actioncable'

// Singleton ActionCable consumer that the entire frontend can share.
export const cable = createConsumer() 