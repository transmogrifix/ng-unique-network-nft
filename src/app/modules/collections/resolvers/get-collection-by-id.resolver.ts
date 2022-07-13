import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {FirebaseService} from "../../../core/services/firebase.service";
import {NFTCollection} from "../../../core/model/nft-collection";

@Injectable()
export class GetCollectionByIdResolver implements Resolve<NFTCollection> {
	constructor(private firebaseService: FirebaseService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<NFTCollection> {
    if(route.paramMap.has('id')) {
		const index = Number(route.paramMap.get('id'));

		return this.firebaseService.getCollectionById(index);
	}
  }
}
