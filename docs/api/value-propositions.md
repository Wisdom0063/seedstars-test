# Value Proposition API Documentation

## Overview

The Value Proposition API provides comprehensive endpoints for managing Value Proposition Canvas data, including customer jobs, pains, gain creators, pain relievers, products/services, and value proposition statements.

## Base URL

```
/api/value-propositions
```

## Authentication

Currently using system-level authentication. In production, implement proper JWT/session-based auth.

## Endpoints

### 1. Get All Value Propositions

**GET** `/api/value-propositions`

Retrieve all value propositions with filtering, sorting, and pagination.

#### Query Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `segmentId` | string | Filter by customer segment ID | - |
| `personaId` | string | Filter by persona ID | - |
| `status` | enum | Filter by status (`DRAFT`, `ACTIVE`, `ARCHIVED`) | - |
| `search` | string | Search in name and description | - |
| `tags` | string | Comma-separated list of tags | - |
| `page` | number | Page number (1-based) | 1 |
| `limit` | number | Items per page | 20 |
| `sortBy` | enum | Sort field (`name`, `createdAt`, `updatedAt`, `status`) | `createdAt` |
| `sortOrder` | enum | Sort order (`asc`, `desc`) | `desc` |

#### Example Request

```bash
GET /api/value-propositions?segmentId=seg_123&status=ACTIVE&page=1&limit=10&sortBy=name&sortOrder=asc
```

#### Example Response

```json
{
  "success": true,
  "data": [
    {
      "id": "vp_123",
      "name": "Professional Development Platform",
      "description": "Comprehensive learning platform for career advancement",
      "status": "ACTIVE",
      "tags": ["education", "professional-development"],
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "createdBy": "system",
      "segmentId": "seg_123",
      "personaId": "persona_456",
      "segment": {
        "id": "seg_123",
        "name": "Early Career Professionals"
      },
      "persona": {
        "id": "persona_456",
        "name": "John Smith"
      },
      "customerJobs": [
        {
          "id": "job_1",
          "title": "Develop foundational skills",
          "description": "Build core competencies needed for career growth",
          "importance": "VERY_IMPORTANT",
          "category": "FUNCTIONAL",
          "order": 0,
          "createdAt": "2024-01-15T10:30:00Z",
          "updatedAt": "2024-01-15T10:30:00Z"
        }
      ],
      "customerPains": [
        {
          "id": "pain_1",
          "title": "Limited access to quality content",
          "description": "Difficulty finding reliable learning materials",
          "severity": "EXTREME_PAIN",
          "category": "OBSTACLES",
          "order": 0,
          "createdAt": "2024-01-15T10:30:00Z",
          "updatedAt": "2024-01-15T10:30:00Z"
        }
      ],
      "gainCreators": [
        {
          "id": "gain_1",
          "title": "Interactive learning content",
          "description": "Engaging educational experiences",
          "priority": "VERY_ESSENTIAL",
          "category": "REQUIRED_GAINS",
          "order": 0,
          "createdAt": "2024-01-15T10:30:00Z",
          "updatedAt": "2024-01-15T10:30:00Z"
        }
      ],
      "painRelievers": [
        {
          "id": "reliever_1",
          "title": "Curated content library",
          "description": "High-quality, vetted learning materials",
          "priority": "VERY_ESSENTIAL",
          "category": "PAIN_KILLER",
          "order": 0,
          "createdAt": "2024-01-15T10:30:00Z",
          "updatedAt": "2024-01-15T10:30:00Z"
        }
      ],
      "productsServices": [
        {
          "id": "product_1",
          "name": "Online Learning Platform",
          "description": "Web-based educational platform",
          "type": "DIGITAL",
          "category": "education",
          "features": "[\"Interactive courses\", \"Progress tracking\"]",
          "order": 0,
          "createdAt": "2024-01-15T10:30:00Z",
          "updatedAt": "2024-01-15T10:30:00Z"
        }
      ],
      "valuePropositionStatements": [
        {
          "id": "stmt_1",
          "offering": "Provide comprehensive learning platform",
          "description": "Deliver career-focused education with industry recognition",
          "createdAt": "2024-01-15T10:30:00Z",
          "updatedAt": "2024-01-15T10:30:00Z"
        }
      ]
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10,
  "totalPages": 3
}
```

### 2. Get Single Value Proposition

**GET** `/api/value-propositions/{id}`

Retrieve a specific value proposition by ID.

#### Example Request

```bash
GET /api/value-propositions/vp_123
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "id": "vp_123",
    "name": "Professional Development Platform",
    // ... (same structure as above)
  }
}
```

### 3. Create Value Proposition

**POST** `/api/value-propositions`

Create a new value proposition with all canvas components.

#### Request Body

```json
{
  "name": "Professional Development Platform",
  "description": "Comprehensive learning platform for career advancement",
  "segmentId": "seg_123",
  "personaId": "persona_456",
  "status": "DRAFT",
  "tags": ["education", "professional-development"],
  "customerJobs": [
    {
      "title": "Develop foundational skills",
      "description": "Build core competencies needed for career growth",
      "importance": "VERY_IMPORTANT",
      "category": "FUNCTIONAL"
    }
  ],
  "customerPains": [
    {
      "title": "Limited access to quality content",
      "description": "Difficulty finding reliable learning materials",
      "severity": "EXTREME_PAIN",
      "category": "OBSTACLES"
    }
  ],
  "gainCreators": [
    {
      "title": "Interactive learning content",
      "description": "Engaging educational experiences",
      "priority": "VERY_ESSENTIAL",
      "category": "REQUIRED_GAINS"
    }
  ],
  "painRelievers": [
    {
      "title": "Curated content library",
      "description": "High-quality, vetted learning materials",
      "priority": "VERY_ESSENTIAL",
      "category": "PAIN_KILLER"
    }
  ],
  "productsServices": [
    {
      "name": "Online Learning Platform",
      "description": "Web-based educational platform",
      "type": "DIGITAL",
      "category": "education",
      "features": ["Interactive courses", "Progress tracking"]
    }
  ],
  "valuePropositionStatements": [
    {
      "offering": "Provide comprehensive learning platform",
      "description": "Deliver career-focused education with industry recognition"
    }
  ]
}
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "id": "vp_new_123",
    "name": "Professional Development Platform",
    // ... (complete value proposition object)
  }
}
```

### 4. Update Value Proposition

**PUT** `/api/value-propositions/{id}`

Complete replacement of all value proposition sections.

**PATCH** `/api/value-propositions/{id}`

Partial update of specific sections.

#### Request Body (PUT - Complete Replacement)

```json
{
  "name": "Updated Platform Name",
  "description": "Updated description",
  "status": "ACTIVE",
  "tags": ["education", "professional-development", "updated"],
  "customerJobs": [
    {
      "title": "New job to be done",
      "description": "Updated job description",
      "importance": "VERY_IMPORTANT",
      "category": "FUNCTIONAL"
    }
  ],
  "customerPains": [],
  "gainCreators": [
    {
      "title": "New gain creator",
      "description": "Updated gain description",
      "priority": "VERY_ESSENTIAL",
      "category": "REQUIRED_GAINS"
    }
  ],
  "painRelievers": [],
  "productsServices": [],
  "valuePropositionStatements": []
}
```

#### Request Body (PATCH - Partial Update)

```json
{
  "name": "Updated Platform Name",
  "status": "ACTIVE",
  "customerJobs": [
    {
      "title": "New job to be done",
      "description": "Updated job description",
      "importance": "VERY_IMPORTANT",
      "category": "FUNCTIONAL"
    }
  ]
}
```

### 5. Delete Value Proposition

**DELETE** `/api/value-propositions/{id}`

Delete a value proposition and all related canvas components.

#### Example Response

```json
{
  "success": true,
  "message": "Value proposition deleted successfully"
}
```

### 6. Get Value Propositions by Segment

**GET** `/api/value-propositions/segment/{segmentId}`

Get all value propositions for a specific customer segment.

#### Example Request

```bash
GET /api/value-propositions/segment/seg_123?status=ACTIVE
```

### 7. Get Value Propositions by Persona

**GET** `/api/value-propositions/persona/{personaId}`

Get all value propositions for a specific persona.

#### Example Request

```bash
GET /api/value-propositions/persona/persona_456?status=ACTIVE
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `NOT_FOUND` | 404 | Resource not found |
| `SEGMENT_NOT_FOUND` | 404 | Customer segment not found |
| `PERSONA_NOT_FOUND` | 404 | Persona not found |
| `FETCH_ERROR` | 500 | Database fetch error |
| `CREATE_ERROR` | 500 | Database create error |
| `UPDATE_ERROR` | 500 | Database update error |
| `DELETE_ERROR` | 500 | Database delete error |

## Data Types

### Enums

```typescript
enum ValuePropositionStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED'
}

enum JobImportance {
  VERY_IMPORTANT = 'VERY_IMPORTANT',
  FAIRLY_IMPORTANT = 'FAIRLY_IMPORTANT',
  NOT_IMPORTANT = 'NOT_IMPORTANT'
}

enum PainSeverity {
  EXTREME_PAIN = 'EXTREME_PAIN',
  MODERATE_PAIN = 'MODERATE_PAIN',
  LOW_PAIN = 'LOW_PAIN'
}

enum GainPriority {
  VERY_ESSENTIAL = 'VERY_ESSENTIAL',
  FAIRLY_ESSENTIAL = 'FAIRLY_ESSENTIAL',
  NOT_ESSENTIAL = 'NOT_ESSENTIAL'
}

enum RelieverPriority {
  VERY_ESSENTIAL = 'VERY_ESSENTIAL',
  FAIRLY_ESSENTIAL = 'FAIRLY_ESSENTIAL',
  NOT_ESSENTIAL = 'NOT_ESSENTIAL'
}

enum ProductType {
  PRODUCT = 'PRODUCT',
  SERVICE = 'SERVICE',
  DIGITAL = 'DIGITAL',
  PHYSICAL = 'PHYSICAL'
}
```

## Usage Examples

### Frontend Integration

```typescript
import { valuePropositionApi } from '@/lib/api/value-proposition';

// Get all value propositions for a segment
const valuePropositions = await valuePropositionApi.getBySegmentId('seg_123');

// Create a new value proposition
const newVP = await valuePropositionApi.create({
  name: 'New Platform',
  segmentId: 'seg_123',
  customerJobs: [
    {
      title: 'Learn new skills',
      description: 'Acquire industry-relevant skills',
      importance: 'VERY_IMPORTANT',
      category: 'FUNCTIONAL'
    }
  ]
});

// Update all sections of a value proposition
const updatedVP = await valuePropositionApi.update({
  id: 'vp_123',
  name: 'Updated Platform',
  customerJobs: [
    {
      title: 'Updated job',
      description: 'Updated description',
      importance: 'VERY_IMPORTANT',
      category: 'FUNCTIONAL'
    }
  ],
  customerPains: [],
  gainCreators: [],
  painRelievers: [],
  productsServices: [],
  valuePropositionStatements: []
});
```

## Performance Considerations

- All related components are fetched in a single query using Prisma's `include`
- Pagination is implemented for large datasets
- Database transactions ensure data consistency during updates
- Proper indexing on foreign keys for optimal query performance

## Security Considerations

- Input validation on all endpoints
- SQL injection protection via Prisma ORM
- Proper error handling without exposing sensitive information
- Rate limiting should be implemented in production
- Authentication and authorization should be added for production use
