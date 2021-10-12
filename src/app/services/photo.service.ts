import {Injectable} from '@angular/core';
import {Camera, CameraResultType, CameraSource, Photo} from '@capacitor/camera';
import {Capacitor} from '@capacitor/core';
import {Directory, Filesystem} from '@capacitor/filesystem';
import {Storage} from '@capacitor/storage';
import {LoadingController, Platform} from '@ionic/angular';
import {Router} from '@angular/router';
import {AngularFireStorage} from '@angular/fire/storage';
import {Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';

export interface MyData {
    name: string;
    filepath: string;
    size: number;
}

@Injectable({
    providedIn: 'root',
})
export class PhotoService {
    public photos: UserPhoto[] = [];
    private PHOTO_STORAGE: string = 'photos';
    deviceToken;
    saveImage;
    base64Image;
    problemId;
    downloadURL: Observable<string>;

    constructor(private platform: Platform, private router: Router,
                public loadingController: LoadingController,
                private storage: AngularFireStorage, private database: AngularFirestore) {
    }


    upload(): void {
        this.loadingController.create({
            spinner: null,
            message: `<div class="custom-spinner-container">
            <img class="loading" src="assets/images/home-main.png" alt="">
            <img class="rotate" width="120px" height="120px" src="assets/images/spinner.png" />
            </div>`
        }).then((res) => {
            res.present();
        });
        const filePath = `Images/${performance.now()}.png`;
        console.log(this.base64Image);
        this.storage.ref(filePath).putString(this.base64Image, this.platform.is('hybrid') ? 'base64' : 'base64').then((r) => {
            r.ref.getDownloadURL().then((url) => {
                this.router.navigate(['/question-screen']);
                Storage.remove({key: 'imgUrl'});
                Storage.set({
                    key: 'imgUrl',
                    value: url,
                });
            });
        });
    }

    async base64ToImage(dataURI) {
        const base64Response = await fetch(`${dataURI}`);
        const blob = await base64Response.blob();
        return blob;
    }

    public async loadSaved() {
        // Retrieve cached photo array data
        Storage.remove({key: this.PHOTO_STORAGE});
        const photoList = await Storage.get({key: this.PHOTO_STORAGE});
        this.photos = JSON.parse(photoList.value) || [];

        // If running on the web...
        if (!this.platform.is('hybrid')) {
            // Display the photo by reading into base64 format
            for (let photo of this.photos) {
                // Read each saved photo's data from the Filesystem
                const readFile = await Filesystem.readFile({
                    path: photo.filepath,
                    directory: Directory.Data,
                });

                // Web platform only: Load the photo as base64 data
                photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
            }
        }
    }

    /* Use the device camera to take a photo:
    // https://capacitor.ionicframework.com/docs/apis/camera

    // Store the photo data into permanent file storage:
    // https://capacitor.ionicframework.com/docs/apis/filesystem

    // Store a reference to all photo filepaths using Storage API:
    // https://capacitor.ionicframework.com/docs/apis/storage
    */
    public async addNewToGallery() {
        Storage.remove({key: this.PHOTO_STORAGE});
        // Take a photo
        let capturedPhoto: any = '';
        capturedPhoto = await Camera.getPhoto({
            resultType: CameraResultType.Uri, // file-based data; provides best performance
            source: CameraSource.Camera, // automatically take a new photo with the camera
            quality: 30, // highest quality (0 to 100)
        });
        this.saveImage = '';
        let savedImageFile: any = '';
        savedImageFile = await this.savePicture(capturedPhoto);
        if (savedImageFile) {
            this.saveImage = capturedPhoto.webPath;
        }

        // Add new photo to Photos array
        this.photos.unshift(savedImageFile);

        // Cache all photo data for future retrieval
        Storage.set({
            key: this.PHOTO_STORAGE,
            value: JSON.stringify(this.photos),
        });
    }

    public async reuestPermission() {
        // Take a photo
        await Camera.requestPermissions().then((re) => {
            console.log(re);
        });
    }

    // Save picture to file on device
    private async savePicture(cameraPhoto: Photo) {
        // Convert photo to base64 format, required by Filesystem API to save
        this.base64Image = '';
        const base64Data = await this.readAsBase64(cameraPhoto);
        console.log(base64Data, 'from camera');
        this.base64Image = base64Data;
        this.problemId = '1';
        Storage.remove({key: 'base64'});
        Storage.set({
            key: 'base64',
            value: base64Data,
        });
        console.log('222222222222');
        // Write the file to the data directory
        const fileName = new Date().getTime() + '.jpeg';
        const savedFile = await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Data,
        });
        console.log('3333333333');
        this.upload();
        if (this.platform.is('hybrid')) {
            console.log('4444444444');
            // Display the new image by rewriting the 'file://' path to HTTP
            // Details: https://ionicframework.com/docs/building/webview#file-protocol
            return {
                filepath: savedFile.uri,
                webviewPath: Capacitor.convertFileSrc(savedFile.uri),
            };
        } else {
            console.log('5555555555');
            // Use webPath to display the new image instead of base64 since it's
            // already loaded into memory
            return {
                filepath: fileName,
                webviewPath: cameraPhoto.webPath,
            };
        }
    }

    // Read camera photo into base64 format based on the platform the app is running on
    private async readAsBase64(cameraPhoto: Photo) {
        // "hybrid" will detect Cordova or Capacitor
        if (this.platform.is('hybrid')) {
            // Read the file into base64 format
            const file = await Filesystem.readFile({
                path: cameraPhoto.path,
            });

            return file.data;
        } else {
            // Fetch the photo, read as a blob, then convert to base64 format
            const response = await fetch(cameraPhoto.webPath!);
            const blob = await response.blob();

            return (await this.convertBlobToBase64(blob)) as string;
        }
    }

    // Delete picture by removing it from reference data and the filesystem
    public async deletePicture(photo: UserPhoto, position: number) {
        // Remove this photo from the Photos reference data array
        this.photos.splice(position, 1);

        // Update photos array cache by overwriting the existing photo array
        Storage.set({
            key: this.PHOTO_STORAGE,
            value: JSON.stringify(this.photos),
        });

        // delete photo file from filesystem
        const filename = photo.filepath.substr(photo.filepath.lastIndexOf('/') + 1);
        await Filesystem.deleteFile({
            path: filename,
            directory: Directory.Data,
        });
    }

    convertBlobToBase64 = (blob: Blob) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.readAsDataURL(blob);
        });
}

export interface UserPhoto {
    filepath: string;
    webviewPath: string;
}
