<?php

namespace App\Repository;

use App\Entity\Movie;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Movie>
 *
 * @method Movie|null find($id, $lockMode = null, $lockVersion = null)
 * @method Movie|null findOneBy(array $criteria, array $orderBy = null)
 * @method Movie[]    findAll()
 * @method Movie[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MovieRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Movie::class);
    }

    //    /**
    //     * @return Movie[] Returns an array of Movie objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('m')
    //            ->andWhere('m.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('m.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Movie
    //    {
    //        return $this->createQueryBuilder('m')
    //            ->andWhere('m.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }

    // public function findMoviesByGenre($idGenre): ?Movie
    // {
    //     return $this->createQueryBuilder('mg')
    //         ->select('mg.movie_id')
    //         ->andWhere('mg.genre_id = :idGenre')
    //         ->setParameter('idGenre', $idGenre)
    //         ->getQuery()
    //         ->getResult();
    // }

    public function findMoviesByGenre($idGenre): ?array
    {
        $qb = $this->createQueryBuilder('m')
            ->join('m.movieGenres', 'mg')
            ->join('mg.genre', 'g')
            ->where('g.id = :idGenre')
            ->setParameter('idGenre', $idGenre)
            ->select('m');
    
        return $qb->getQuery()->getResult();
    }

}
