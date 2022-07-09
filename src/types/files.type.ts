export interface UploadeFileMulter {
    [fieldname: string]: {
        filename: string;
        size: number;
        mimetype: string;
        originalname: string;
        fieldname: string;
        encoding: string;
    }[] | undefined
}

export interface AfterCheckFile {
    filename: string;
    size: number;
    mimetype: string;
    originalname: string;
    fieldname: string;
    encoding: string;
}

export interface fileSafeRecord {
    id: string;
    name: string;
    type: string;
    size: string;
}

export interface FileRecord {
    id?: string;
    type: string;
    orginalName: string;
    name: string;
    size: number;
    extension: string;

}

export interface fileBody {
    type: string;
    originalname: string;
}

export interface SendingFormat {
    files: fileSafeRecord[],
    fotos: fileSafeRecord[]
}

export interface FreeSpace {
    fileSpace: number;
    fotoSpace: number;
}