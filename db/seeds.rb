# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Dummy data for chat demo
require 'securerandom'

ActiveRecord::Base.transaction do
  user = User.find_or_create_by!(email: 'john@example.com') do |u|
    u.password = 'password'
    u.password_confirmation = 'password'
  end

  # Only create dummy chats if none exist to keep the seeds idempotent
  unless Chat.exists?
    chats_data = [
      {
        title: 'React Best Practices',
        messages: [
          { role: 'user', content: 'What are some React best practices I should follow?' },
          { role: 'assistant', content: 'Here are some key React best practices:\n\n1. Use functional components with hooks\n2. Keep components small and focused\n3. Use proper state management\n4. Optimize re-renders\n5. Follow naming conventions', model_id: 'gpt-4' },
          { role: 'user', content: 'Can you explain more about useEffect best practices?' },
          { role: 'assistant', content: 'Certainly! Always add dependencies, clean up side-effects, separate concerns, and avoid infinite loops.', model_id: 'gpt-4' }
        ]
      },
      {
        title: 'TypeScript Question',
        messages: [
          { role: 'user', content: 'How do I type this generic function in TypeScript?' },
          { role: 'assistant', content: 'Use generics like so:\n\n```typescript\nfunction myFn<T>(param: T): T { return param; }\n```', model_id: 'claude-3.5' }
        ]
      }
    ]

    chats_data.each do |chat_data|
      chat = Chat.create!(
        user: user,
        model_id: chat_data[:messages].last[:model_id] || 'gpt-4',
        title: chat_data[:title]
      )

      chat_data[:messages].each do |msg|
        Message.create!(chat: chat, role: msg[:role], content: msg[:content], model_id: msg[:model_id])
      end
    end
  end
end
