import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



// Helper functions
export function getUniqueOptions(data: any[], path: string, valuePath?: string): Array<{ id: string, label: string, value: any, count: number }> {
  const values = new Map<string, { label: string; value: any; count: number }>();

  data.forEach(item => {
    const value = getNestedValue(item, path);
    const key = getNestedValue(item, valuePath || path);

    if (value && key) {
      const existing = values.get(key);
      if (existing) {
        existing.count++;
      } else {
        values.set(key, { label: value, value: key, count: 1 });
      }
    }
  });

  return Array.from(values.entries()).map(([id, data]) => ({
    id,
    label: data.label,
    value: data.value,
    count: data.count,
  }));
}

export function getFlattenedOptions(data: any[], path: string): Array<{ id: string, label: string, value: any, count: number }> {
  const values = new Map<string, number>();

  data.forEach(item => {
    // Handle paths that access properties of array items (e.g., 'arrayField.property')
    if (path.includes('.')) {
      const [arrayPath, propertyPath] = path.split('.', 2);
      const array = getNestedValue(item, arrayPath);

      if (Array.isArray(array)) {
        array.forEach(arrayItem => {
          if (arrayItem) {
            const value = getNestedValue(arrayItem, propertyPath);
            if (value) {
              values.set(value, (values.get(value) || 0) + 1);
            }
          }
        });
      }
    } else {
      // For simple array paths, use the generic approach
      const array = getNestedValue(item, path);
      if (Array.isArray(array)) {
        array.forEach(value => {
          if (value) {
            values.set(value, (values.get(value) || 0) + 1);
          }
        });
      }
    }
  });

  return Array.from(values.entries()).map(([value, count]) => ({
    id: value,
    label: value,
    value,
    count,
  }));
}

export function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}



export const isFieldVisible = (visibleFields: string[], fieldName: string) => {
  return visibleFields.length === 0 || visibleFields.includes(fieldName);
};
