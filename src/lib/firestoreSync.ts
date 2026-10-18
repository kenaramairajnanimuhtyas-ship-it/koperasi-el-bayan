import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  Produk,
  Kategori,
  Order,
  Transaksi,
  StoreSettings,
  Konsumen,
} from '../types';

const COLLECTIONS = {
  PRODUK: 'products',
  KATEGORI: 'categories',
  ORDERS: 'orders',
  TRANSAKSI: 'transactions',
  SETTINGS: 'settings',
  KONSUMEN: 'customers',
};

/**
 * Recursively cleans an object by removing any properties with value `undefined`.
 * Firestore rejects writes with FirebaseError if any field in setDoc / batch.set is undefined.
 */
export function cleanDataForFirestore<T>(data: T): T {
  if (data === null || typeof data !== 'object') {
    return data;
  }
  if (Array.isArray(data)) {
    return data
      .filter((item) => item !== undefined)
      .map((item) => cleanDataForFirestore(item)) as unknown as T;
  }
  const cleanObj: Record<string, any> = {};
  for (const [key, value] of Object.entries(data as Record<string, any>)) {
    if (value !== undefined) {
      cleanObj[key] = cleanDataForFirestore(value);
    }
  }
  return cleanObj as T;
}

export class FirestoreSyncService {
  /**
   * Listen to real-time products collection
   */
  static subscribeProducts(onUpdate: (products: Produk[]) => void, onError?: (err: any) => void) {
    const colRef = collection(db, COLLECTIONS.PRODUK);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const items: Produk[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as Produk);
        });
        // Sort by id_produk ascending
        items.sort((a, b) => a.id_produk - b.id_produk);
        onUpdate(items);
      },
      (error) => {
        console.error('Firestore products subscription error:', error);
        onError?.(error);
      }
    );
  }

  /**
   * Listen to real-time categories collection
   */
  static subscribeCategories(onUpdate: (cats: Kategori[]) => void, onError?: (err: any) => void) {
    const colRef = collection(db, COLLECTIONS.KATEGORI);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const items: Kategori[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as Kategori);
        });
        items.sort((a, b) => a.id_kategori - b.id_kategori);
        onUpdate(items);
      },
      (error) => {
        console.error('Firestore categories subscription error:', error);
        onError?.(error);
      }
    );
  }

  /**
   * Listen to real-time orders collection
   */
  static subscribeOrders(onUpdate: (orders: Order[]) => void, onError?: (err: any) => void) {
    const colRef = collection(db, COLLECTIONS.ORDERS);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const items: Order[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as Order);
        });
        // Sort by date descending
        items.sort((a, b) => new Date(b.tanggal_pesanan).getTime() - new Date(a.tanggal_pesanan).getTime());
        onUpdate(items);
      },
      (error) => {
        console.error('Firestore orders subscription error:', error);
        onError?.(error);
      }
    );
  }

  /**
   * Listen to real-time transactions collection
   */
  static subscribeTransactions(onUpdate: (trx: Transaksi[]) => void, onError?: (err: any) => void) {
    const colRef = collection(db, COLLECTIONS.TRANSAKSI);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const items: Transaksi[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as Transaksi);
        });
        items.sort((a, b) => new Date(b.tanggal_transaksi).getTime() - new Date(a.tanggal_transaksi).getTime());
        onUpdate(items);
      },
      (error) => {
        console.error('Firestore transactions subscription error:', error);
        onError?.(error);
      }
    );
  }

  /**
   * Listen to settings
   */
  static subscribeSettings(onUpdate: (settings: StoreSettings) => void) {
    const docRef = doc(db, COLLECTIONS.SETTINGS, 'general');
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          onUpdate(docSnap.data() as StoreSettings);
        }
      },
      (error) => {
        console.error('Firestore settings subscription error:', error);
      }
    );
  }

  /**
   * Seed initial data to Firestore if collection is empty
   */
  static async seedInitialData(
    initialData: {
      produk: Produk[];
      kategori: Kategori[];
      orders: Order[];
      transaksi: Transaksi[];
      settings: StoreSettings;
    }
  ) {
    try {
      const prodCol = collection(db, COLLECTIONS.PRODUK);
      const prodSnap = await getDocs(prodCol);

      if (prodSnap.empty) {
        console.log('Seeding initial data into Firestore...');
        const batch = writeBatch(db);

        // Seed products
        initialData.produk.forEach((p) => {
          const docRef = doc(db, COLLECTIONS.PRODUK, String(p.id_produk));
          batch.set(docRef, cleanDataForFirestore(p));
        });

        // Seed categories
        initialData.kategori.forEach((c) => {
          const docRef = doc(db, COLLECTIONS.KATEGORI, String(c.id_kategori));
          batch.set(docRef, cleanDataForFirestore(c));
        });

        // Seed orders
        initialData.orders.forEach((o) => {
          const docRef = doc(db, COLLECTIONS.ORDERS, String(o.id_pesanan));
          batch.set(docRef, cleanDataForFirestore(o));
        });

        // Seed transactions
        initialData.transaksi.forEach((t) => {
          const docRef = doc(db, COLLECTIONS.TRANSAKSI, String(t.id_transaksi));
          batch.set(docRef, cleanDataForFirestore(t));
        });

        // Seed settings
        const settingsRef = doc(db, COLLECTIONS.SETTINGS, 'general');
        batch.set(settingsRef, cleanDataForFirestore(initialData.settings));

        await batch.commit();
        console.log('Initial data seeded successfully to Firestore');
      }
    } catch (err) {
      console.warn('Could not seed Firestore initial data (will use local cache):', err);
    }
  }

  // --- Write Operations ---
  static async saveProduct(prod: Produk) {
    try {
      const docRef = doc(db, COLLECTIONS.PRODUK, String(prod.id_produk));
      await setDoc(docRef, cleanDataForFirestore(prod));
    } catch (err) {
      console.error('Firestore saveProduct error:', err);
    }
  }

  static async deleteProduct(productId: number) {
    try {
      const docRef = doc(db, COLLECTIONS.PRODUK, String(productId));
      await deleteDoc(docRef);
    } catch (err) {
      console.error('Firestore deleteProduct error:', err);
    }
  }

  static async saveCategory(cat: Kategori) {
    try {
      const docRef = doc(db, COLLECTIONS.KATEGORI, String(cat.id_kategori));
      await setDoc(docRef, cleanDataForFirestore(cat));
    } catch (err) {
      console.error('Firestore saveCategory error:', err);
    }
  }

  static async deleteCategory(catId: number) {
    try {
      const docRef = doc(db, COLLECTIONS.KATEGORI, String(catId));
      await deleteDoc(docRef);
    } catch (err) {
      console.error('Firestore deleteCategory error:', err);
    }
  }

  static async saveOrder(order: Order) {
    try {
      const docRef = doc(db, COLLECTIONS.ORDERS, String(order.id_pesanan));
      await setDoc(docRef, cleanDataForFirestore(order));
    } catch (err) {
      console.error('Firestore saveOrder error:', err);
    }
  }

  static async saveTransaction(trx: Transaksi) {
    try {
      const docRef = doc(db, COLLECTIONS.TRANSAKSI, String(trx.id_transaksi));
      await setDoc(docRef, cleanDataForFirestore(trx));
    } catch (err) {
      console.error('Firestore saveTransaction error:', err);
    }
  }

  static async saveSettings(settings: StoreSettings) {
    try {
      const docRef = doc(db, COLLECTIONS.SETTINGS, 'general');
      await setDoc(docRef, cleanDataForFirestore(settings));
    } catch (err) {
      console.error('Firestore saveSettings error:', err);
    }
  }

  static async syncAllProducts(products: Produk[]) {
    try {
      const batch = writeBatch(db);
      products.forEach((p) => {
        const docRef = doc(db, COLLECTIONS.PRODUK, String(p.id_produk));
        batch.set(docRef, cleanDataForFirestore(p));
      });
      await batch.commit();
    } catch (err) {
      console.error('Firestore syncAllProducts error:', err);
    }
  }
}
