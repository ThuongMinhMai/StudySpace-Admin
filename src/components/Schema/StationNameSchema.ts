import { z } from 'zod'
export const RoomNameSchema = z.object({
	roomName: z
		.string()
		.min(2, 'Tên phòng phải nhiều hơn 2 kí tự')
		.max(40, 'Tên trạm ít hơn 40 kí tự')
})

export const amityNameSchema = z.object({
	amityName: z.string().min(2, 'Tên tiện ích phải nhiều hơn 2 kí tự')
})