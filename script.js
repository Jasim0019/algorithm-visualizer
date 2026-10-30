/**
 * Algorithm & Logic Visualizer
 * Developed by Shaik Mohammed Jasim (SRM University, 2025-2029)
 */

class AlgorithmVisualizer {
  constructor() {
    this.container = document.getElementById('visualizer-bars');
    this.sizeSlider = document.getElementById('size-slider');
    this.sizeLabel = document.getElementById('size-label');
    this.speedSlider = document.getElementById('speed-slider');
    this.speedLabel = document.getElementById('speed-label');
    this.randomizeBtn = document.getElementById('randomize-btn');
    this.startBtn = document.getElementById('start-btn');
    this.soundToggleBtn = document.getElementById('sound-toggle-btn');
    this.soundStatus = document.getElementById('sound-status');
    
    this.statComparisons = document.getElementById('stat-comparisons');
    this.statSwaps = document.getElementById('stat-swaps');
    this.statComplexity = document.getElementById('stat-complexity');
    this.statSpace = document.getElementById('stat-space');
    this.infoTitle = document.getElementById('algo-info-title');
    this.infoDesc = document.getElementById('algo-info-desc');
    
    this.array = [];
    this.isRunning = false;
    this.currentAlgo = 'bubble';
    this.comparisons = 0;
    this.swaps = 0;
    this.soundEnabled = true;
    
    // Audio Context for sound synthesis
    this.audioCtx = null;

    this.algoInfo = {
      bubble: {
        title: 'Bubble Sort',
        desc: 'Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.',
        time: 'O(n²) Average',
        space: 'O(1) Auxiliary'
      },
      quick: {
        title: 'Quick Sort (Divide & Conquer)',
        desc: 'Selects a pivot element and partitions the array into sub-arrays of elements less than and greater than the pivot.',
        time: 'O(n log n) Average',
        space: 'O(log n) Recursive'
      },
      merge: {
        title: 'Merge Sort',
        desc: 'Divides the array into two halves, recursively sorts them, and merges the sorted halves together.',
        time: 'O(n log n) Best/Avg/Worst',
        space: 'O(n) Auxiliary'
      },
      insertion: {
        title: 'Insertion Sort',
        desc: 'Builds the sorted array one element at a time by repeatedly taking the next element and inserting it into its correct position.',
        time: 'O(n²) Average',
        space: 'O(1) Auxiliary'
      },
      binary: {
        title: 'Binary Search (on sorted array)',
        desc: 'Searches for a target value within a sorted array by repeatedly dividing the search interval in half.',
        time: 'O(log n) Worst/Avg',
        space: 'O(1) Auxiliary'
      }
    };

    this.init();
  }

  init() {
    this.generateArray();
    this.bindEvents();
    this.updateAlgoInfo();
  }

  initAudio() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
  }

  playTone(freq = 440, duration = 0.05) {
    if (!this.soundEnabled) return;
    try {
      this.initAudio();
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  bindEvents() {
    this.sizeSlider.addEventListener('input', (e) => {
      this.sizeLabel.textContent = e.target.value;
      if (!this.isRunning) this.generateArray();
    });

    this.speedSlider.addEventListener('input', (e) => {
      this.speedLabel.textContent = `${e.target.value}ms`;
    });

    this.randomizeBtn.addEventListener('click', () => {
      if (!this.isRunning) this.generateArray();
    });

    this.startBtn.addEventListener('click', () => {
      if (!this.isRunning) this.run();
    });

    this.soundToggleBtn.addEventListener('click', () => {
      this.soundEnabled = !this.soundEnabled;
      this.soundStatus.textContent = this.soundEnabled ? 'Sound ON' : 'Sound OFF';
    });

    document.querySelectorAll('.algo-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.isRunning) return;
        document.querySelectorAll('.algo-btn').forEach(b => {
          b.classList.remove('bg-purple-600', 'text-white', 'shadow-lg', 'shadow-purple-600/30');
          b.classList.add('bg-slate-800', 'text-slate-300');
        });
        btn.classList.add('bg-purple-600', 'text-white', 'shadow-lg', 'shadow-purple-600/30');
        btn.classList.remove('bg-slate-800', 'text-slate-300');
        
        this.currentAlgo = btn.getAttribute('data-algo');
        this.updateAlgoInfo();
        if (this.currentAlgo === 'binary') {
          this.array.sort((a, b) => a - b);
          this.render();
        }
      });
    });
  }

  updateAlgoInfo() {
    const info = this.algoInfo[this.currentAlgo];
    if (info) {
      this.infoTitle.textContent = info.title;
      this.infoDesc.textContent = info.desc;
      this.statComplexity.textContent = info.time;
      this.statSpace.textContent = info.space;
    }
  }

  generateArray() {
    const size = parseInt(this.sizeSlider.value, 10);
    this.array = [];
    for (let i = 0; i < size; i++) {
      this.array.push(Math.floor(Math.random() * 88) + 12);
    }
    this.comparisons = 0;
    this.swaps = 0;
    this.updateStats();
    this.render();
  }

  updateStats() {
    this.statComparisons.textContent = this.comparisons;
    this.statSwaps.textContent = this.swaps;
  }

  render(comparing = [], sorted = [], pivot = -1) {
    this.container.innerHTML = '';
    const n = this.array.length;
    this.array.forEach((val, idx) => {
      const bar = document.createElement('div');
      bar.className = 'bar flex-1 bar-default';
      bar.style.height = `${val}%`;

      if (sorted.includes(idx)) {
        bar.className = 'bar flex-1 bar-sorted';
      } else if (pivot === idx) {
        bar.className = 'bar flex-1 bar-pivot';
      } else if (comparing.includes(idx)) {
        bar.className = 'bar flex-1 bar-comparing';
      }

      this.container.appendChild(bar);
    });
  }

  sleep() {
    const delay = 105 - parseInt(this.speedSlider.value, 10);
    return new Promise(resolve => setTimeout(resolve, Math.max(delay, 5)));
  }

  async run() {
    this.isRunning = true;
    this.startBtn.disabled = true;
    this.randomizeBtn.disabled = true;
    this.comparisons = 0;
    this.swaps = 0;
    this.updateStats();

    switch (this.currentAlgo) {
      case 'bubble':
        await this.bubbleSort();
        break;
      case 'insertion':
        await this.insertionSort();
        break;
      case 'quick':
        await this.quickSort(0, this.array.length - 1);
        break;
      case 'merge':
        await this.mergeSort(0, this.array.length - 1);
        break;
      case 'binary':
        await this.binarySearch();
        break;
    }

    // Finished animation
    this.render([], this.array.map((_, i) => i));
    this.playTone(880, 0.2);
    this.isRunning = false;
    this.startBtn.disabled = false;
    this.randomizeBtn.disabled = false;
  }

  async bubbleSort() {
    const n = this.array.length;
    let sortedIndices = [];
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        this.comparisons++;
        this.updateStats();
        this.render([j, j + 1], sortedIndices);
        this.playTone(180 + this.array[j] * 6);
        await this.sleep();

        if (this.array[j] > this.array[j + 1]) {
          let temp = this.array[j];
          this.array[j] = this.array[j + 1];
          this.array[j + 1] = temp;
          this.swaps++;
          this.updateStats();
          this.render([j, j + 1], sortedIndices);
          await this.sleep();
        }
      }
      sortedIndices.push(n - i - 1);
    }
  }

  async insertionSort() {
    const n = this.array.length;
    let sortedIndices = [0];
    for (let i = 1; i < n; i++) {
      let key = this.array[i];
      let j = i - 1;
      this.render([i], sortedIndices, i);
      await this.sleep();

      while (j >= 0 && this.array[j] > key) {
        this.comparisons++;
        this.swaps++;
        this.updateStats();
        this.array[j + 1] = this.array[j];
        this.render([j, j + 1], sortedIndices, i);
        this.playTone(200 + this.array[j] * 6);
        await this.sleep();
        j--;
      }
      this.array[j + 1] = key;
      sortedIndices.push(i);
      this.render([], sortedIndices);
      await this.sleep();
    }
  }

  async quickSort(low, high) {
    if (low < high) {
      let pi = await this.partition(low, high);
      await this.quickSort(low, pi - 1);
      await this.quickSort(pi + 1, high);
    }
  }

  async partition(low, high) {
    let pivot = this.array[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      this.comparisons++;
      this.updateStats();
      this.render([j, high], [], high);
      this.playTone(220 + this.array[j] * 6);
      await this.sleep();

      if (this.array[j] < pivot) {
        i++;
        let temp = this.array[i];
        this.array[i] = this.array[j];
        this.array[j] = temp;
        this.swaps++;
        this.updateStats();
        this.render([i, j], [], high);
        await this.sleep();
      }
    }
    let temp = this.array[i + 1];
    this.array[i + 1] = this.array[high];
    this.array[high] = temp;
    this.swaps++;
    this.updateStats();
    this.render([i + 1, high], [], high);
    await this.sleep();
    return i + 1;
  }

  async mergeSort(l, r) {
    if (l >= r) return;
    const m = l + Math.floor((r - l) / 2);
    await this.mergeSort(l, m);
    await this.mergeSort(m + 1, r);
    await this.merge(l, m, r);
  }

  async merge(l, m, r) {
    const n1 = m - l + 1;
    const n2 = r - m;
    let L = new Array(n1);
    let R = new Array(n2);

    for (let i = 0; i < n1; i++) L[i] = this.array[l + i];
    for (let j = 0; j < n2; j++) R[j] = this.array[m + 1 + j];

    let i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
      this.comparisons++;
      this.updateStats();
      this.render([k], [], m);
      this.playTone(200 + L[i] * 6);
      await this.sleep();

      if (L[i] <= R[j]) {
        this.array[k] = L[i];
        i++;
      } else {
        this.array[k] = R[j];
        j++;
      }
      this.swaps++;
      this.updateStats();
      k++;
    }

    while (i < n1) {
      this.array[k] = L[i];
      i++;
      k++;
      this.swaps++;
      this.updateStats();
      this.render([k], []);
      await this.sleep();
    }

    while (j < n2) {
      this.array[k] = R[j];
      j++;
      k++;
      this.swaps++;
      this.updateStats();
      this.render([k], []);
      await this.sleep();
    }
  }

  async binarySearch() {
    this.array.sort((a, b) => a - b);
    this.render();
    const target = this.array[Math.floor(this.array.length * 0.7)];
    let low = 0;
    let high = this.array.length - 1;

    while (low <= high) {
      this.comparisons++;
      this.updateStats();
      let mid = Math.floor((low + high) / 2);
      this.render([mid], [], mid);
      this.playTone(250 + this.array[mid] * 6);
      await this.sleep();

      if (this.array[mid] === target) {
        this.render([], [mid]);
        this.playTone(900, 0.3);
        return;
      }
      if (this.array[mid] < target) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new AlgorithmVisualizer();
});
