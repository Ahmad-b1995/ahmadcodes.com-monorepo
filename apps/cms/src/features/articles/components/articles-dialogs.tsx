import { ArticlesActionDialog } from './articles-action-dialog'
import { ArticlesDeleteDialog } from './articles-delete-dialog'
import { useArticlesStore } from '../stores/articles-store'

export function ArticlesDialogs() {
  const { open, currentRow, closeDialog } = useArticlesStore()
  return (
    <>
      <ArticlesActionDialog
        key='article-add'
        open={open === 'add'}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            closeDialog()
          }
        }}
      />

      {currentRow && (
        <>
          <ArticlesActionDialog
            key={`article-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                closeDialog()
              }
            }}
            currentRow={currentRow}
          />

          <ArticlesDeleteDialog
            key={`article-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                closeDialog()
              }
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}

