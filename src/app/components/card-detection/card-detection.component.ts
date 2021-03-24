import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgOpenCVService } from 'ng-open-cv';
@Component({
  selector: 'mtg-card-detection',
  templateUrl: './card-detection.component.html',
  styleUrls: ['./card-detection.component.scss'],
})
export class CardDetectionComponent implements OnInit, OnDestroy {
  @ViewChild('cam') cam!: ElementRef;
  @ViewChild('canvas') canvas!: ElementRef;
  @ViewChild('canvas1') canvas1!: ElementRef;
  @ViewChild('canvas2') canvas2!: ElementRef;

  cameraStarted: boolean = false;

  constructor(private openCVService: NgOpenCVService) {}

  ngOnInit(): void {
    this.openCVService.startCamera(
      640,
      (stream: any) => {
        if (stream) {
          this.cam.nativeElement.srcObject = stream;
          this.cam.nativeElement.play();
          this.cameraStarted = true;
          let src = new cv.Mat(480, 640, cv.CV_8UC4);
          let cap = new cv.VideoCapture(this.cam.nativeElement);
          setTimeout(() => {
            this.detectCard(cap, src);
          }, 0);
        }
      },
      this.cam
    );
  }

  ngOnDestroy(): void {
    this.cameraStarted = false;
    this.openCVService.stopCamera();
  }

  detectCard(cap: any, src: any) {
    const begin = Date.now();
    cap.read(src);

    //preprocessing
    let img_gray = new cv.Mat(480, 640, cv.CV_8UC1);
    cv.cvtColor(src, img_gray, cv.COLOR_BGR2GRAY);
    let img_blur = new cv.Mat(480, 640, cv.CV_8UC1);
    cv.medianBlur(img_gray, img_blur, 9);
    let img_thresh = new cv.Mat(480, 640, cv.CV_8UC1);
    cv.adaptiveThreshold(
      img_blur,
      img_thresh,
      255,
      cv.ADAPTIVE_THRESH_MEAN_C,
      cv.THRESH_BINARY_INV,
      5,
      10
    );
    const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(3, 3));
    let img_dilate = new cv.Mat(480, 640, cv.CV_8UC1);
    cv.dilate(img_thresh, img_dilate, kernel, new cv.Point(-1, -1), 1);
    let img_erode = new cv.Mat(480, 640, cv.CV_8UC1);
    cv.erode(img_dilate, img_erode, kernel, new cv.Point(-1, -1), 1);

    // detect rectangle
    let cnts = new cv.MatVector();
    let hier = new cv.Mat();
    cv.findContours(
      img_erode,
      cnts,
      hier,
      cv.RETR_LIST,
      cv.CHAIN_APPROX_SIMPLE
    );

    let cnts_rect = new cv.MatVector();
    for (let i = 0; i < cnts.size(); ++i) {
      let cnt = cnts.get(i);
      const size = cv.contourArea(cnt, true);
      const peri = cv.arcLength(cnt, false);
      let approx = new cv.Mat();
      cv.approxPolyDP(cnt, approx, 0.04 * peri, true);
      if (size >= 100 && approx.size().width * approx.size().height === 4) {
        cnts_rect.push_back(approx);
      }
      approx.delete();
    }

    let warpedImages = new cv.MatVector();

    //calc warp
    for (let i = 0; i < cnts_rect.size(); ++i) {
      let points = [
        {
          x: parseFloat(cnts_rect.get(i).data32S[0]),
          y: parseFloat(cnts_rect.get(i).data32S[1]),
          sum:
            parseFloat(cnts_rect.get(i).data32S[0]) +
            parseFloat(cnts_rect.get(i).data32S[1]),
          diff:
            parseFloat(cnts_rect.get(i).data32S[0]) -
            parseFloat(cnts_rect.get(i).data32S[1]),
        },
        {
          x: parseFloat(cnts_rect.get(i).data32S[2]),
          y: parseFloat(cnts_rect.get(i).data32S[3]),
          sum:
            parseFloat(cnts_rect.get(i).data32S[2]) +
            parseFloat(cnts_rect.get(i).data32S[3]),
          diff:
            parseFloat(cnts_rect.get(i).data32S[2]) -
            parseFloat(cnts_rect.get(i).data32S[3]),
        },
        {
          x: parseFloat(cnts_rect.get(i).data32S[4]),
          y: parseFloat(cnts_rect.get(i).data32S[5]),
          sum:
            parseFloat(cnts_rect.get(i).data32S[4]) +
            parseFloat(cnts_rect.get(i).data32S[5]),
          diff:
            parseFloat(cnts_rect.get(i).data32S[4]) -
            parseFloat(cnts_rect.get(i).data32S[5]),
        },
        {
          x: parseFloat(cnts_rect.get(i).data32S[6]),
          y: parseFloat(cnts_rect.get(i).data32S[7]),
          sum:
            parseFloat(cnts_rect.get(i).data32S[6]) +
            parseFloat(cnts_rect.get(i).data32S[7]),
          diff:
            parseFloat(cnts_rect.get(i).data32S[6]) -
            parseFloat(cnts_rect.get(i).data32S[7]),
        },
      ];

      let tl, tr, br, bl;

      const first = points.find(
        (ps) => Math.min(...points.map((p) => p.sum)) === ps.sum
      );
      tl = [first!.x, first!.y];
      const third = points.find(
        (ps) => Math.max(...points.map((p) => p.sum)) === ps.sum
      );
      br = [third!.x, third!.y];

      const second = points.find(
        (ps) => Math.max(...points.map((p) => p.diff)) === ps.diff
      );
      tr = [second!.x, second!.y];
      const fourth = points.find(
        (ps) => Math.min(...points.map((p) => p.diff)) === ps.diff
      );
      bl = [fourth!.x, fourth!.y];

      // compute the width of the new image, which will be the
      // maximum distance between bottom-right and bottom-left
      // x-coordiates or the top-right and top-left x-coordinates
      let widthA = Math.sqrt((br[0] - bl[0]) ** 2 + (br[1] - bl[1]) ** 2);
      let widthB = Math.sqrt((tr[0] - tl[0]) ** 2 + (tr[1] - tl[1]) ** 2);
      let maxWidth = Math.max(widthA, widthB);

      // compute the height of the new image, which will be the
      // maximum distance between the top-right and bottom-right
      // y-coordinates or the top-left and bottom-left y-coordinates
      let heightA = Math.sqrt((tr[0] - br[0]) ** 2 + (tr[1] - br[1]) ** 2);
      let heightB = Math.sqrt((tl[0] - bl[0]) ** 2 + (tl[1] - bl[1]) ** 2);
      let maxHeight = Math.max(heightA, heightB);

      let finalDestCoords = cv.matFromArray(1, 4, cv.CV_32FC2, [
        0,
        0,
        maxWidth,
        0,
        maxWidth,
        maxHeight,
        0,
        maxHeight,
      ]);
      let srcCoords = cv.matFromArray(1, 4, cv.CV_32FC2, [
        tl[0],
        tl[1],
        tr[0],
        tr[1],
        br[0],
        br[1],
        bl[0],
        bl[1],
      ]);

      let size = new cv.Size(maxHeight, maxWidth);

      // compute the perspective transform matrix and then apply it
      let mat = cv.getPerspectiveTransform(srcCoords, finalDestCoords);
      let warped = new cv.Mat();
      cv.warpPerspective(src, warped, mat, size);

      // If the image is horizontally long, rotate it by 90
      if (maxWidth > maxHeight) {
        let center = new cv.Point(maxHeight / 2, maxWidth / 2);
        let mat_rot = cv.getRotationMatrix2D(center, 270, 1.0);
        cv.warpAffine(
          warped,
          warped,
          mat_rot,
          size,
          cv.INTER_LINEAR,
          cv.BORDER_CONSTANT,
          new cv.Scalar()
        );
        mat_rot.delete();
      }

      warpedImages.push_back(warped.clone());

      mat.delete();
      finalDestCoords.delete();
      srcCoords.delete();
      warped.delete();
    }

    if (warpedImages.size() > 0) {
      cv.imshow(this.canvas1.nativeElement, warpedImages.get(0));
    }

    if (warpedImages.size() > 1) {
      cv.imshow(this.canvas2.nativeElement, warpedImages.get(1));
    }

    let dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);

    // draw contours
    for (let i = 0; i < cnts_rect.size(); ++i) {
      cv.drawContours(dst, cnts_rect, i, new cv.Scalar(0, 255, 0, 1), 1);
    }

    cv.imshow(this.canvas.nativeElement, dst);
    const delay = 1000 / 10 - (Date.now() - begin);
    if (this.cameraStarted) {
      setTimeout(() => {
        this.detectCard(cap, src);
      }, delay);
    }

    warpedImages.delete();
    img_erode.delete();
    img_gray.delete();
    img_thresh.delete();
    img_blur.delete();
    img_dilate.delete();
    cnts.delete();
    hier.delete();
  }
}
