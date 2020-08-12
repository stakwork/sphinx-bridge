import { SphinxProvider } from './provider';

export function requestProvider(): Promise<SphinxProvider> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      return reject(new Error('Must be called in a browser context'));
    }

    const sphinx: SphinxProvider = (window as any).sphinx;
    if (!sphinx) {
      return reject(new Error('Your browser has no Sphinx provider'));
    }

    sphinx.enable().then(() => resolve(sphinx));
  });
}