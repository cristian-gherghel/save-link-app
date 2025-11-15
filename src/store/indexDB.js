// src/utils/indexedDB.js

const DB_NAME = 'SuperDev'
const STORE_NAME = 'bookmarks'
const DB_VERSION = 1

let dbInstance = null
initDB()

// Initialize database connection
function initDB () {
  if (dbInstance) return dbInstance

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      reject(request.error)
    }

    request.onsuccess = () => {
      dbInstance = request.result
      resolve(dbInstance)
    }

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
  })
}

// Get database instance
async function getDB () {
  if (!dbInstance) {
    dbInstance = await initDB()
  }
  return dbInstance
}

export async function getAllDataWithKeys () {
  try {
    const db = await getDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.openCursor()
      const items = []

      request.onerror = () => reject(request.error)

      request.onsuccess = (event) => {
        const cursor = event.target.result
        if (cursor) {
          items.push({
            key: cursor.key,
            value: cursor.value
          })
          cursor.continue()
        } else {
          resolve(items)
        }
      }
    })
  } catch (error) {
    console.error('Error getting all data with keys:', error)
    throw error
  }
}

// Save data
export async function saveData (key, value) {
  try {
    const db = await getDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.put(value, key)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(value)
    })
  } catch (error) {
    console.error('Error saving data:', error)
    throw error
  }
}

// Get data
export async function getData (key) {
  try {
    const db = await getDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get(key)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  } catch (error) {
    console.error('Error getting data:', error)
    throw error
  }
}

// Delete data
export async function deleteData (key) {
  try {
    const db = await getDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.delete(key)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  } catch (error) {
    console.error('Error deleting data:', error)
    throw error
  }
}

// Clear all data
export async function clearStore () {
  try {
    const db = await getDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.clear()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  } catch (error) {
    console.error('Error clearing store:', error)
    throw error
  }
}

// Get all data
export async function getAllData () {
  try {
    const db = await getDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.getAll()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  } catch (error) {
    console.error('Error getting all data:', error)
    throw error
  }
}

// Get all keys
export async function getAllKeys () {
  try {
    const db = await getDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.getAllKeys()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  } catch (error) {
    console.error('Error getting all keys:', error)
    throw error
  }
}

// Check if IndexedDB is available
export function isSupported () {
  try {
    return 'indexedDB' in window && window.indexedDB !== null
  } catch (e) {
    return false
  }
}

// Close database connection
export function closeDB () {
  if (dbInstance) {
    dbInstance.close()
    dbInstance = null
  }
}

export async function updateData (key, updates) {
  try {
    const db = await getDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite')
      const store = transaction.objectStore(STORE_NAME)

      // First get the existing data
      const getRequest = store.get(key)

      getRequest.onerror = () => reject(getRequest.error)

      getRequest.onsuccess = () => {
        const existingData = getRequest.result

        // If data exists, merge with updates
        if (existingData) {
          const updatedData = {
            ...existingData,
            ...updates
          }

          // Put the updated data
          const putRequest = store.put(updatedData, key)

          putRequest.onerror = () => reject(putRequest.error)
          putRequest.onsuccess = () => resolve(updatedData)
        } else {
          // If no existing data, just save the updates
          const putRequest = store.put(updates, key)

          putRequest.onerror = () => reject(putRequest.error)
          putRequest.onsuccess = () => resolve(updates)
        }
      }
    })
  } catch (error) {
    console.error('Error updating data:', error)
    throw error
  }
}