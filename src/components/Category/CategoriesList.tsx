import { useTranslations } from "next-intl";
import { DTOCategory } from "podverse-helpers";
import React from "react";
import Link from "../Link/Link";
// import SubHeader from "../List/ListHeader";
import { useCategories } from "../../contexts/Categories";
import styles from "../../styles/components/Category/CategoriesList.module.scss";

type CategoriesListProps = {
  onCategoryClick: (category: DTOCategory, event: React.MouseEvent<HTMLButtonElement>) => void;
};

function CategoryListItems({
  categories,
  tCategories,
  onCategoryClick,
}: {
  categories: DTOCategory[];
  tCategories: any;
  onCategoryClick: (category: DTOCategory, event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  if (!categories || categories.length === 0) return null;
  return (
    <ul className={styles.categoryList}>
      {categories.map((category) => (
        <li key={category.id}>
          <Link onClick={(e) => onCategoryClick(category, e)}>
            {tCategories(category.mapping_key)}
          </Link>
          {category.children && category.children.length > 0 && (
            <CategoryListItems
              categories={category.children}
              tCategories={tCategories}
              onCategoryClick={onCategoryClick}
            />
          )}
        </li>
      ))}
    </ul>
  );
}

const CategoriesList = ({ onCategoryClick }: CategoriesListProps) => {
  const { categories } = useCategories();
  const tCategories = useTranslations("categories");

  return (
    <section aria-labelledby="categories-heading">
      {/* <SubHeader title={tCategories("categories")} /> */}
      <nav>
        <CategoryListItems
          categories={categories}
          tCategories={tCategories}
          onCategoryClick={onCategoryClick}
        />
      </nav>
    </section>
  );
};

export default CategoriesList;
