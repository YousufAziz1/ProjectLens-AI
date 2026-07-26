import fs from 'fs/promises';
import path from 'path';

const isVercel = !!process.env.VERCEL;
const DATA_DIR = isVercel ? path.join('/tmp', 'projectlens-data') : path.join(process.cwd(), '.projectlens-data');

class PersistentStorage {
    private async ensureDir() {
        try {
            await fs.mkdir(DATA_DIR, { recursive: true });
        } catch (e) {
            // directory exists
        }
    }

    async saveCollection(id: string, data: unknown): Promise<void> {
        await this.ensureDir();
        await fs.writeFile(path.join(DATA_DIR, `${id}.json`), JSON.stringify(data, null, 2));
    }

    async getCollection(id: string): Promise<unknown | null> {
        try {
            const file = await fs.readFile(path.join(DATA_DIR, `${id}.json`), 'utf-8');
            return JSON.parse(file);
        } catch (error) {
            return null;
        }
    }
}

// Export a singleton instance
export const storage = new PersistentStorage();
