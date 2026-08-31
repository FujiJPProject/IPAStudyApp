import type { Component } from 'vue'

export interface MaterialMetadata {
  id: string
  name: string
  field: string
  summary: string
}

export interface MaterialDefinition {
  metadata: MaterialMetadata
  component: Component
}
