import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { mergeMap, of, tap } from 'rxjs';
import { LoadingIndicator } from '../../../components/LoadingIndicator';
import { ApplicationContext } from '../../../contexts';
import { Category } from '../../../models/catalog';
import { getTitle } from '../../../utils';
import { CategoryList } from './CategoryList';

export function CategoryListManagement(): ReactElement {
  const [categoryList, setCategoryList] = useState<Array<Category>>([]);
  const [fetching, setFetching] = useState(false);
  const { catalogService } = useContext(ApplicationContext);

  useEffect(() => {
    const fetchCategoryList$ = of(true)
      .pipe(
        tap(() => setFetching(true)),
        mergeMap(() =>
          catalogService!
            .fetchCategoryList()
            .pipe(tap((categoryList) => setCategoryList(categoryList)))
        )
      )
      .subscribe({
        error: () => setFetching(false),
        complete: () => setFetching(false),
      });

    return () => fetchCategoryList$.unsubscribe();
  }, [catalogService]);

  return (
    <>
      <Helmet>
        <title>{getTitle('Categories')}</title>
      </Helmet>

      {fetching ? <LoadingIndicator /> : <CategoryList list={categoryList} />}
    </>
  );
}
