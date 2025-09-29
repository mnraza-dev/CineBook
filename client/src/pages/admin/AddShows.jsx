import React, { useMemo, useState } from 'react'
import TitleSection from '../../components/TitleSection'
import { dummyShowsData, dummyDateTimeData } from '../../assets/assets'
import toast from 'react-hot-toast'

const AddShows = () => {
  const [movieId, setMovieId] = useState('')
  const [date, setDate] = useState('')
  const [showId, setShowId] = useState('')
  const [price, setPrice] = useState('')

  const timesForSelectedDate = useMemo(() => {
    if (!date) return []
    return (dummyDateTimeData[date] || [])
  }, [date])

  const onSubmit = (e) => {
    e.preventDefault()
    if (!movieId) return toast.error('Please select a movie')
    if (!date) return toast.error('Please select a date')
    if (!showId) return toast.error('Please select a time')
    if (!price || Number(price) <= 0) return toast.error('Please enter a valid price')

    // Simulate API call
    const payload = { movieId, date, showId, price: Number(price) }
    // In real app, POST to backend here
    // await api.post('/admin/shows', payload)

    console.log('Add Show payload:', payload)
    toast.success('Show added successfully')

    // Reset form
    setMovieId('')
    setDate('')
    setShowId('')
    setPrice('')
  }

  return (
    <div className="p-6 space-y-4">
      <TitleSection title={'Add Shows'} className='text-3xl' />

      <form onSubmit={onSubmit} className="space-y-4 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Movie</label>
            <select
              value={movieId}
              onChange={(e) => setMovieId(e.target.value)}
              className="w-full bg-[#111] border border-gray-700 rounded-lg p-2 text-white"
            >
              <option value="">Select a movie</option>
              {dummyShowsData.map(m => (
                <option key={m._id} value={m._id}>{m.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Date</label>
            <select
              value={date}
              onChange={(e) => {
                setDate(e.target.value)
                setShowId('')
              }}
              className="w-full bg-[#111] border border-gray-700 rounded-lg p-2 text-white"
            >
              <option value="">Select a date</option>
              {Object.keys(dummyDateTimeData).map(d => (
                <option key={d} value={d}>{new Date(d).toLocaleDateString()}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Time</label>
            <select
              value={showId}
              onChange={(e) => setShowId(e.target.value)}
              disabled={!date}
              className="w-full bg-[#111] border border-gray-700 rounded-lg p-2 text-white disabled:opacity-60"
            >
              <option value="">{date ? 'Select a time' : 'Select date first'}</option>
              {timesForSelectedDate.map(t => (
                <option key={t.showId} value={t.showId}>
                  {new Date(t.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Price</label>
            <input
              type="number"
              min="1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 59"
              className="w-full bg-[#111] border border-gray-700 rounded-lg p-2 text-white"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="login-gradient-diagonal hover:bg-[#f5ec9b] text-black px-6 py-2 rounded-lg font-semibold text-base hover:opacity-90 transition cursor-pointer"
          >
            Add Show
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddShows