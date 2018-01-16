import { Router } from 'express';
import * as LaneController from '../controllers/lane.controller';

const router = new Router();

router.route('/lanes').get(LaneController.getLanes);

router.route('/lanes').post(LaneController.addLane);

router.route('/lanes/:laneId').delete(LaneController.deleteLane);

router.route('/lanes/:laneId/name').post(LaneController.editName);

router.route('/lanes/update').post(LaneController.updateLanes);

export default router;
