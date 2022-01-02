import { Skeleton } from 'antd';
import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { mergeMap, of, tap } from 'rxjs';
import { ApplicationContext } from '../../../contexts';
import { Vendor } from '../../../models/vendor';
import VendorDetails from './VendorDetails';

export function VendorDetailsManagement(): ReactElement {
  const { vendorService } = useContext(ApplicationContext);
  const { id } = useParams<{ id: UniqueId }>();

  const [fetching, setFetching] = useState(false);
  const [vendor, setVendor] = useState<Vendor>({
    id: '',
    name: '',
    email: '',
    hotline: '',
    logoUrl: '',
    slug: '',
    introduction: '',
    isActive: false,
    ownerId: '',
    registeredAt: '',
    updatedAt: '',
    categories: [],
  });

  useEffect(() => {
    const fetchVendor$ = of(true)
      .pipe(
        tap(() => setFetching(true)),
        mergeMap(() => vendorService!.fetchById(id).pipe(tap(setVendor)))
      )
      .subscribe({
        error: () => setFetching(false),
        complete: () => setFetching(false),
      });

    return () => fetchVendor$.unsubscribe();
  }, [vendorService, id]);

  return (
    <>{fetching ? <Skeleton active /> : <VendorDetails vendor={vendor} />}</>
  );
}
