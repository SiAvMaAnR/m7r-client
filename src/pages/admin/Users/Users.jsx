import { useCallback, useEffect, useState } from 'react'
import api from '../../../api/api'
import { UserItem, PageHeader, Pagination } from '../../../components/_exports'
import Loader1 from '../../../components/common/Loader/Loader1/Loader1'
import './Users.scss'

const pageSize = 15

function Users() {
  const [isLoading, setIsLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [pageNumber, setPageNumber] = useState(0)
  const [pagesCount, setPagesCount] = useState(0)

  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true)

      const { data, response } = await api.user.users({
        pageNumber,
        pageSize
      })

      if (response?.data?.clientMessage) {
        throw new Error(response.data.clientMessage)
      }

      if (!data || response?.data?.errors) {
        throw new Error('Something went wrong')
      }

      setUsers(data.users || [])
      setPagesCount(data.meta?.pagesCount || 1)
    } catch (err) {
      // temp
    } finally {
      setIsLoading(false)
    }
  }, [pageNumber])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const onNext = () => {
    if (pageNumber + 1 < pagesCount) {
      setPageNumber((number) => number + 1)
    }
  }

  const onPrev = () => {
    if (pageNumber > 0) {
      setPageNumber((number) => number - 1)
    }
  }

  return (
    <div className="p-users">
      <PageHeader className="users-header" text="Users" />

      <div className="users-content">
        {isLoading ? (
          <Loader1 className="loader" />
        ) : (
          <table className="users-table">
            <thead className="table-head">
              <tr>
                <th width="8%" aria-label="image">
                  {}
                </th>
                <th width="5%">Id</th>
                <th className="email" width="20%">Email</th>
                <th className="login" width="15%">Login</th>
                <th width="5%">Birthday</th>
                <th width="5%">Status</th>
                <th width="5%">Banned</th>
                <th width="5%" aria-label="tools">
                  {}
                </th>
              </tr>
            </thead>

            <tbody className="table-body">
              {users.map((user) => (
                <UserItem key={user.id} userInfo={user} loadUsers={loadUsers} />
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination
        className="users-pagination"
        pageNumber={pageNumber}
        pagesCount={pagesCount}
        onNext={onNext}
        onPrev={onPrev}
      />
    </div>
  )
}

export default Users
