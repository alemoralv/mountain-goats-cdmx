# Admin Guide: User Training Files

## Overview

User training files are personalized documents, videos, or workout plans that administrators upload specifically for individual users. These files appear in the user's profile under "Mis Pre-Entrenamientos" (My Pre-Trainings).

## Storage Location

User training files are stored in Supabase Storage in a bucket called `user-training-files`.

### Setting Up the Storage Bucket

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New Bucket**
4. Create a bucket with:
   - **Name**: `user-training-files`
   - **Public**: `false` (keep it private)

### Folder Structure

Organize files by user ID for easy management:

```
user-training-files/
├── {user-uuid-1}/
│   ├── workout-plan-week1.pdf
│   ├── nutrition-guide.pdf
│   └── technique-video.mp4
├── {user-uuid-2}/
│   ├── custom-training.pdf
│   └── stretching-routine.pdf
└── ...
```

## Database Table

Files metadata is stored in the `user_training_files` table:

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Unique identifier |
| `user_id` | UUID | The user this file belongs to |
| `title` | TEXT | Display title (e.g., "Plan de Entrenamiento Semana 1") |
| `description` | TEXT | Optional description |
| `file_url` | TEXT | URL to the file in Supabase Storage |
| `file_type` | TEXT | Type: `pdf`, `video`, `image`, `document` |
| `file_size_bytes` | INTEGER | File size in bytes |
| `category` | TEXT | Category for organization |
| `uploaded_by` | UUID | Admin who uploaded the file |
| `sort_order` | INTEGER | Display order |

### Categories

- `general` - General information
- `workout` - Exercise and workout plans
- `nutrition` - Dietary guides and meal plans
- `technique` - Hiking techniques and tips
- `medical` - Medical forms or health-related documents

## How to Upload a Training File

### Using Supabase Dashboard

1. **Upload the file to Storage**:
   - Go to Storage → `user-training-files`
   - Create a folder with the user's UUID (if not exists)
   - Upload the file

2. **Get the file URL**:
   - Click on the uploaded file
   - Copy the URL (it will be a signed URL or you can generate one)

3. **Add the record to the database**:
   - Go to Table Editor → `user_training_files`
   - Insert a new row with:
     - `user_id`: The user's UUID
     - `title`: A friendly display name
     - `description`: Optional details
     - `file_url`: The storage URL
     - `file_type`: pdf/video/image/document
     - `category`: general/workout/nutrition/technique/medical
     - `sort_order`: Number for ordering (lower = first)

### Using SQL

```sql
INSERT INTO user_training_files (
  user_id,
  title,
  description,
  file_url,
  file_type,
  category,
  sort_order
) VALUES (
  'user-uuid-here',
  'Plan de Entrenamiento - Nevado de Toluca',
  'Plan personalizado de 4 semanas para prepararte para la caminata',
  'https://your-supabase-url.supabase.co/storage/v1/object/sign/user-training-files/...',
  'pdf',
  'workout',
  1
);
```

## Finding a User's ID

To find a user's UUID:

```sql
SELECT id, full_name, nickname, 
       (SELECT email FROM auth.users WHERE auth.users.id = profiles.id) as email
FROM profiles
WHERE nickname ILIKE '%search-term%'
   OR full_name ILIKE '%search-term%';
```

Or in Supabase Dashboard:
1. Go to **Authentication** → **Users**
2. Find the user by email
3. Copy their User UID

## Permissions

The storage bucket has Row Level Security (RLS) enabled:
- Users can only view their own files
- Admins (using service role) can upload files for any user

## Best Practices

1. **Use descriptive titles**: Users see these in their profile
2. **Keep files organized**: Use the folder structure by user ID
3. **Compress large files**: Especially videos
4. **Set appropriate sort order**: Most important files first
5. **Use categories**: Helps users find relevant content quickly

