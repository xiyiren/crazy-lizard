// ===== Storage: localStorage History & Image Export =====

const STORAGE_KEY = 'tarot-history';
const MAX_HISTORY = 50;

// Save a reading to localStorage
function saveReading(reading) {
  try {
    const history = getHistory();
    history.unshift(reading);
    if (history.length > MAX_HISTORY) {
      history.length = MAX_HISTORY;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    return true;
  } catch (e) {
    console.warn('Failed to save reading:', e);
    return false;
  }
}

// Get all history
function getHistory() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.warn('Failed to read history:', e);
    return [];
  }
}

// Delete a single reading by ID
function deleteReading(id) {
  try {
    const history = getHistory();
    const filtered = history.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (e) {
    console.warn('Failed to delete reading:', e);
    return false;
  }
}

// Clear all history
function clearHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (e) {
    console.warn('Failed to clear history:', e);
    return false;
  }
}

// Export a DOM element as PNG image
function exportImage(elementId, filename = 'tarot-reading.png') {
  return new Promise((resolve, reject) => {
    const element = document.getElementById(elementId);
    if (!element) {
      reject(new Error('Element not found'));
      return;
    }

    if (typeof html2canvas === 'undefined') {
      reject(new Error('html2canvas not loaded'));
      return;
    }

    html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#0a0a0f',
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    }).then((canvas) => {
      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      resolve(true);
    }).catch((err) => {
      console.warn('html2canvas failed:', err);
      reject(err);
    });
  });
}

export { saveReading, getHistory, deleteReading, clearHistory, exportImage };
