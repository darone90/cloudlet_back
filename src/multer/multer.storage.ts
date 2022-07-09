import * as path from 'path';
import { FileRecord, fileSafeRecord } from 'src/types/files.type';

export const destionation = (): string => {
    const pathName = path.join(__dirname, '../../storage')
    return pathName
}

export const dataFilter = (file: FileRecord): fileSafeRecord => {
    return {
        id: file.id,
        name: file.orginalName,
        type: file.type,
        size: String(file.size),
    }
}